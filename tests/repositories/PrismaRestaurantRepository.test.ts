import { PrismaClient } from "@prisma/client";
import { Container, id } from "inversify";
import "reflect-metadata";
import { IRestaurantRepository } from "../../src/infrastructure/interfaces/IRestaurantRepository";
import { PrismaRestaurantRepository } from "../../src/infrastructure/PrismaRestaurantRepository";
import { CUSTOMER_T } from "../../src/shared/inversify/customer.types";
import {
  Context,
  createMockContext,
  MockContext,
} from "../infrastructure/context";
import { randomUUID } from "crypto";
import { getMockedUUIDString } from "../shared/mockUUID";
import { RESTAURANT_T } from "../../src/shared/inversify/restaurant.types";
import { TYPES } from "../../src/shared/inversify/types";
import { Restaurant } from "../../src/domain/Restaurant";
import { faker } from "@faker-js/faker";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RepositoryError } from "../../src/errors/RepositoryError";
import { InternalServerError } from "../../src/errors/HttpError";
import { EntityNotFoundError } from "../../src/errors/DomainError";
import { afterEach } from "node:test";
import { PrismaErrCode } from "../../src/shared/enum/PrismaCode";
import { getMockRestaurant } from "../shared/mockInstances";
let mockCtx: MockContext;
let ctx: Context;
let testContainer: Container;
let idCount: number;

let sut: PrismaRestaurantRepository;

const setUp = () => {
  mockCtx = createMockContext();
  testContainer = new Container();
  idCount = 0;

  testContainer
    .bind<PrismaClient>(TYPES.PrismaClient)
    .toConstantValue(mockCtx.prisma);

  testContainer
    .bind<IRestaurantRepository>(RESTAURANT_T.PrismaRestaurantRepository)
    .to(PrismaRestaurantRepository);

  (randomUUID as jest.Mock).mockReturnValue(getMockedUUIDString(idCount++));

  sut = testContainer.get<PrismaRestaurantRepository>(
    RESTAURANT_T.PrismaRestaurantRepository
  );
};

const clearDown = () => {
  testContainer.unbindAll();
  idCount = 0;
};

const latestId = () => getMockedUUIDString(idCount - 1);

describe("[CREATE] PrismaRestaurantRepository", () => {
  beforeEach(() => {
    setUp();
  });

  afterEach(() => {
    clearDown();
  });

  it("Should call save and return data as result", async () => {
    const newRest = getMockRestaurant();

    mockCtx.prisma.restaurant.create.mockResolvedValue(newRest.toJSON());

    const result = await sut.save(newRest);

    expect(result).toEqual(newRest);
  });

  it("Should throw repository error if it's a prisma error", async () => {
    const newRest = getMockRestaurant();

    mockCtx.prisma.restaurant.create.mockRejectedValue(
      new PrismaClientKnownRequestError("Mock Error", {
        code: "P2022",
        clientVersion: "",
      })
    );

    try {
      await sut.save(newRest);
    } catch (err) {
      expect(err).toBeInstanceOf(RepositoryError);
    }
  });

  it("Should throw internal server error if it's not prisma error", async () => {
    const newRest = getMockRestaurant();

    mockCtx.prisma.restaurant.create.mockRejectedValue(new Error());

    try {
      await sut.save(newRest);
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerError);
    }
  });
});

describe("[GET] PrismaRestaurantRepository", () => {
  beforeEach(() => {
    setUp();
  });

  afterEach(() => {
    testContainer.unbindAll();
    idCount = 0;
  });

  it("Should return correct restaurant data by restaurantId", async () => {
    const restData = getMockRestaurant();

    mockCtx.prisma.restaurant.findUnique.mockResolvedValue(restData.toJSON());

    const result = await sut.find(latestId());

    expect(result).toEqual(restData);
  });

  it("Should return all exists customer array successfully", async () => {
    const restData1 = getMockRestaurant();

    const restaurants = [restData1];

    mockCtx.prisma.restaurant.findMany.mockResolvedValue(
      restaurants.map((r) => r.toJSON())
    );

    const result = await sut.findAll();

    expect(result.length).toBe(restaurants.length);
    expect(result[0]).toBeInstanceOf(Restaurant);
    expect(result[0]).toStrictEqual(restData1);
  });

  it("Should throw entity not found error for prisma result being null (Invalid Id)", async () => {
    mockCtx.prisma.restaurant.findUnique.mockResolvedValue(null);

    idCount++;

    try {
      await sut.find(latestId());
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it("Should also return empty array if prisma return empty array", async () => {
    mockCtx.prisma.restaurant.findMany.mockResolvedValue([]);
    const result = await sut.findAll();
    expect(result.length).toBe(0);
  });
});

describe("[UPDATE] PrismaRestaurantRepository", () => {
  beforeEach(() => {
    setUp();
  });

  afterEach(() => {
    clearDown();
  });

  it("Should return updated restaurant data from prisma by restaurantId", async () => {
    const restData = getMockRestaurant();

    const updatedData = new Restaurant(
      restData.restaurantId,
      "NewName",
      restData.phone,
      restData.address
    );

    const { restaurantId, name, phone, address } = updatedData;

    mockCtx.prisma.restaurant.update.mockResolvedValue({
      restaurantId,
      name,
      phone,
      address,
    });

    const result = await sut.update(restaurantId, updatedData);

    expect(result!.name).toEqual(updatedData.name);
  });

  it("Should throw entity not found error if prisma throw not found error", async () => {
    mockCtx.prisma.restaurant.update.mockImplementation(() => {
      throw new PrismaClientKnownRequestError("Mock Error", {
        code: PrismaErrCode.NOT_FOUND,
        clientVersion: "",
      });
    });

    try {
      await sut.update("1", getMockRestaurant());
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it("Should throw internal server error if other error was thrown", async () => {
    mockCtx.prisma.restaurant.update.mockImplementation(() => {
      throw new Error();
    });

    try {
      await sut.update("1", getMockRestaurant());
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerError);
    }
  });

  it("Should throw repository error if other prisma error was thrown", async () => {
    mockCtx.prisma.restaurant.update.mockImplementation(() => {
      throw new PrismaClientKnownRequestError("Mock Error", {
        code: "P2022",
        clientVersion: "",
      });
    });

    try {
      await sut.update("1", getMockRestaurant());
    } catch (err) {
      expect(err).toBeInstanceOf(RepositoryError);
    }
  });
});

describe("[DELETE] PrismaCustomerRepository", () => {
  beforeEach(() => {
    setUp();
  });

  afterEach(() => {
    clearDown();
  });

  it("Should return true if prisma return deleted data", async () => {
    const existedData = getMockRestaurant();
    mockCtx.prisma.restaurant.delete.mockResolvedValue(existedData.toJSON());

    const result = await sut.delete(latestId());

    expect(result).toBeTruthy();
  });

  it("Should throw entity not found error if prisma throw not found error", async () => {
    const existedData = getMockRestaurant();

    mockCtx.prisma.restaurant.delete.mockImplementation(() => {
      throw new PrismaClientKnownRequestError("Mock Error", {
        code: PrismaErrCode.NOT_FOUND,
        clientVersion: "",
      });
    });

    try {
      await sut.delete(latestId());
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it("Should throw internal server error if other error was thrown", async () => {
    const existedData = getMockRestaurant();

    mockCtx.prisma.restaurant.delete.mockImplementation(() => {
      throw new Error();
    });

    try {
      const result = await sut.delete(latestId());
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerError);
    }
  });

  it("Should throw repository error if prisma throw other known error", async () => {
    const existedData = getMockRestaurant();

    mockCtx.prisma.restaurant.delete.mockImplementation(() => {
      throw new PrismaClientKnownRequestError("Mock Error", {
        code: "P2022",
        clientVersion: "",
      });
    });

    try {
      const result = await sut.delete(latestId());
    } catch (err) {
      expect(err).toBeInstanceOf(RepositoryError);
    }
  });

  it("Should return true if prisma delete all successful ", async () => {
    mockCtx.prisma.restaurant.deleteMany.mockResolvedValue({ count: 1 });

    const result = await sut.deleteAll();

    expect(result).toBeTruthy();
  });
  it("Should throw internal server error if other error was thrown", async () => {
    mockCtx.prisma.restaurant.deleteMany.mockImplementation(() => {
      throw new Error("");
    });

    try {
      await sut.deleteAll();
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerError);
    }
  });
  it("Should throw repository error if prisma error was thrown", async () => {
    mockCtx.prisma.restaurant.deleteMany.mockImplementation(() => {
      throw new PrismaClientKnownRequestError("Mock Error", {
        code: "P2022",
        clientVersion: "",
      });
    });

    try {
      await sut.deleteAll();
    } catch (err) {
      expect(err).toBeInstanceOf(RepositoryError);
    }
  });
});
