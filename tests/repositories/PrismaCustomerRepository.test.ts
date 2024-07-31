import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { randomUUID } from "crypto";
import { Container } from "inversify";
import "reflect-metadata";
import { ICreateCustomerDto } from "../../src/application/customer/CreateCustomerUseCase";
import { IUpdateCustomerDto } from "../../src/application/customer/UpdateCustomerUseCase";
import { Customer } from "../../src/domain/Customer";
import { EntityNotFoundError } from "../../src/errors/DomainError";
import { InternalServerError } from "../../src/errors/HttpError";
import { RepositoryError } from "../../src/errors/RepositoryError";
import { PrismaCustomerRepository } from "../../src/infrastructure/PrismaCustomerRepository";
import { ICustomerRepository } from "../../src/shared/ICustomerRepository";
import { TYPES } from "../../src/shared/types";
import {
  Context,
  createMockContext,
  MockContext,
} from "../infrastructure/context";
import { prismaMock } from "../infrastructure/mockSingleton";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

const getMockedUUIDString = (n: number) => `${n}-${n}-${n}-${n}-${n}`;

describe("[CREATE] PrimaCustomerRepository", () => {
  let mockCtx: MockContext;
  let ctx: Context;
  let testContainer: Container;
  let mockedUUID: string;
  let idCount = 0;

  let sut: PrismaCustomerRepository;

  beforeEach(() => {
    mockCtx = createMockContext();
    testContainer = new Container();

    testContainer
      .bind<PrismaClient>(TYPES.PrismaClient)
      .toConstantValue(prismaMock);

    testContainer
      .bind<ICustomerRepository>(TYPES.PrismaCustomerRepository)
      .to(PrismaCustomerRepository);

    (randomUUID as jest.Mock).mockImplementation(() => {
      mockedUUID = getMockedUUIDString(idCount);
      idCount++;
      return mockedUUID;
    });

    sut = testContainer.get<PrismaCustomerRepository>(
      TYPES.PrismaCustomerRepository
    );
  });

  afterEach(() => {
    testContainer.unbindAll();
  });

  it("Should call save and return true as result.", async () => {
    const customerData = new Customer(
      undefined,
      "John",
      "Doe",
      "john.d@mail.com",
      "1234"
    );

    mockCtx.prisma.customer.create.mockResolvedValue(customerData.toJSON());

    const result = await sut.save(customerData);

    expect(result).toEqual(true);
  });

  it("Should throw repository error if it's a prisma error.", async () => {
    const customerData = new Customer(
      undefined,
      "John",
      "Doe",
      "john.d@mail.com",
      "1234"
    );

    mockCtx.prisma.customer.create.mockRejectedValue(new Error());

    try {
      await sut.save(customerData);
    } catch (err) {
      expect(err).toBeInstanceOf(RepositoryError);
    }
  });

  it("Should throw internal server error if it's not prisma error", async () => {
    const customerData = new Customer(
      undefined,
      "John",
      "Doe",
      "john.d@mail.com",
      "1234"
    );

    mockCtx.prisma.customer.create.mockRejectedValue(new Error());

    try {
      await sut.save(customerData);
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerError);
    }
  });
});

describe("[GET] PrismaCustomerRepository", () => {
  let mockCtx: MockContext;
  let testContainer: Container;
  let mockedUUID: string;
  let idCount = 0;

  let sut: PrismaCustomerRepository;

  beforeEach(() => {
    mockCtx = createMockContext();
    testContainer = new Container();

    testContainer
      .bind<PrismaClient>(TYPES.PrismaClient)
      .toConstantValue(mockCtx.prisma);

    testContainer
      .bind<ICustomerRepository>(TYPES.PrismaCustomerRepository)
      .to(PrismaCustomerRepository);

    (randomUUID as jest.Mock).mockImplementation(() => {
      mockedUUID = getMockedUUIDString(idCount);
      idCount++;
      return mockedUUID;
    });

    sut = testContainer.get<PrismaCustomerRepository>(
      TYPES.PrismaCustomerRepository
    );
  });

  afterEach(() => {
    testContainer.unbindAll();
    idCount = 0;
  });

  it("Should return correct customer data by customerID ", async () => {
    const customerData = new Customer(
      undefined,
      "John",
      "Doe",
      "john.d@mail.com",
      "1234"
    );

    mockCtx.prisma.customer.findUnique.mockResolvedValue(customerData.toJSON());

    const result = await sut.find(getMockedUUIDString(idCount - 1));

    expect(mockCtx.prisma.customer.findUnique).toHaveBeenCalledWith({
      where: { customerId: getMockedUUIDString(idCount - 1) },
    });
    expect(result).toEqual(customerData);
  });

  it("Should return all exists customer array", async () => {
    const customerData = new Customer(
      undefined,
      "John",
      "Doe",
      "john.d@mail.com",
      "1234"
    );

    const customers = [customerData];

    mockCtx.prisma.customer.findMany.mockResolvedValue(customers);

    const result = await sut.findAll();

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(customerData);
  });

  it("Should throw entity not found error for invalid ID", async () => {
    mockCtx.prisma.customer.findUnique.mockResolvedValue(null);

    try {
      await sut.find(getMockedUUIDString(idCount));
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it("Should throw data integrity error if no result array", async () => {
    mockCtx.prisma.customer.findMany.mockResolvedValue([]);
    try {
      await sut.findAll();
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });
});

describe("[UPDATE] PrismaCustomerRepository", () => {
  let mockCtx: MockContext;
  let testContainer: Container;
  let mockedUUID: string;
  let idCount = 0;

  let sut: PrismaCustomerRepository;

  beforeEach(() => {
    mockCtx = createMockContext();
    testContainer = new Container();

    testContainer
      .bind<PrismaClient>(TYPES.PrismaClient)
      .toConstantValue(mockCtx.prisma);

    testContainer
      .bind<ICustomerRepository>(TYPES.PrismaCustomerRepository)
      .to(PrismaCustomerRepository);

    (randomUUID as jest.Mock).mockImplementation(() => {
      mockedUUID = getMockedUUIDString(idCount);
      idCount++;
      return mockedUUID;
    });

    sut = testContainer.get<PrismaCustomerRepository>(
      TYPES.PrismaCustomerRepository
    );
  });

  afterEach(() => {
    testContainer.unbindAll();
  });

  it("Should return updated customer data successfully by customerID", async () => {
    const customerData = new Customer(
      undefined,
      "John",
      "Doe",
      "jane.d@mail.com",
      "1234"
    );

    const updateDto = {
      customerId: getMockedUUIDString(idCount),
      data: {
        fName: "Jane",
        lName: customerData.lName,
        email: customerData.email,
        phone: customerData.phone,
      } as ICreateCustomerDto,
    } as IUpdateCustomerDto;

    const updatedData = new Customer(
      updateDto.customerId,
      updateDto.data.fName,
      updateDto.data.lName,
      updateDto.data.email,
      updateDto.data.phone
    );

    mockCtx.prisma.customer.update.mockResolvedValue(updatedData.toJSON());

    const result = await sut.update(updatedData.customerId, updatedData);

    expect(mockCtx.prisma.customer.update).toHaveBeenCalledWith({
      where: { customerId: updatedData.customerId },
      data: updatedData.toJSON(),
    });

    expect(result.fName).toEqual(updateDto.data.fName);
  });

  it("Should throw entity not found error if prisma throw not found error", async () => {
    mockCtx.prisma.customer.update.mockImplementation(() => {
      throw new PrismaClientKnownRequestError("Mock Error", {
        code: "P2025",
        clientVersion: "",
      });
    });

    try {
      await sut.update("1", new Customer(undefined, "", "", "", ""));
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it("Should throw internal server error if other error was thrown.", async () => {
    mockCtx.prisma.customer.update.mockImplementation(() => {
      throw new Error();
    });

    try {
      await sut.update("1", new Customer(undefined, "", "", "", ""));
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerError);
    }
  });

  it("Should throw repository error if other prisma error was thrown.", async () => {
    mockCtx.prisma.customer.update.mockImplementation(() => {
      throw new PrismaClientKnownRequestError("Mock Error", {
        code: "P2022",
        clientVersion: "",
      });
    });

    try {
      await sut.update("1", new Customer(undefined, "", "", "", ""));
    } catch (err) {
      expect(err).toBeInstanceOf(RepositoryError);
    }
  });
});

describe("[DELETE] PrismaCustomerRepository", () => {
  let mockCtx: MockContext;
  let testContainer: Container;
  let mockedUUID: string;
  let idCount = 0;

  let sut: PrismaCustomerRepository;

  beforeEach(() => {
    mockCtx = createMockContext();
    testContainer = new Container();

    testContainer
      .bind<PrismaClient>(TYPES.PrismaClient)
      .toConstantValue(mockCtx.prisma);

    testContainer
      .bind<ICustomerRepository>(TYPES.PrismaCustomerRepository)
      .to(PrismaCustomerRepository);

    (randomUUID as jest.Mock).mockImplementation(() => {
      mockedUUID = getMockedUUIDString(idCount);
      idCount++;
      return mockedUUID;
    });

    sut = testContainer.get<PrismaCustomerRepository>(
      TYPES.PrismaCustomerRepository
    );
  });

  afterEach(() => {
    testContainer.unbindAll();
    idCount = 0;
  });

  it("Should return true if prisma delete the data successful.", async () => {
    const existedData = new Customer(
      undefined,
      "John",
      "Doe",
      "john.d@mail.com",
      "1234"
    );

    mockCtx.prisma.customer.delete.mockResolvedValue(existedData);

    const result = await sut.delete(getMockedUUIDString(idCount - 1));

    expect(mockCtx.prisma.customer.delete).toHaveBeenCalledWith({
      where: { customerId: existedData.customerId },
    });
    expect(result).toBe(true);
  });

  it("Should throw entity not found error if prisma throw not found error", async () => {
    mockCtx.prisma.customer.delete.mockImplementation(() => {
      throw new PrismaClientKnownRequestError("Mock Error", {
        code: "P2025",
        clientVersion: "",
      });
    });

    try {
      const result = await sut.delete(getMockedUUIDString(idCount));
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it("Should throw internal server error if other error was thrown", async () => {
    mockCtx.prisma.customer.delete.mockImplementation(() => {
      throw new Error();
    });

    try {
      const result = await sut.delete(getMockedUUIDString(idCount));
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerError);
    }
  });

  it("Should throw repository error if prisma throw other error", async () => {
    mockCtx.prisma.customer.delete.mockImplementation(() => {
      throw new PrismaClientKnownRequestError("Mock Error", {
        code: "P2025",
        clientVersion: "",
      });
    });

    try {
      const result = await sut.delete(getMockedUUIDString(idCount));
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it("Should throw internal server error if other error was thrown", async () => {
    mockCtx.prisma.customer.delete.mockImplementation(() => {
      throw new PrismaClientKnownRequestError("Mock Error", {
        code: "P2022",
        clientVersion: "",
      });
    });

    try {
      const result = await sut.delete(getMockedUUIDString(idCount));
    } catch (err) {
      expect(err).toBeInstanceOf(RepositoryError);
    }
  });

  it("Should return true if prisma delete all sucessful", async () => {
    mockCtx.prisma.customer.deleteMany.mockResolvedValue({ count: 1 });

    const result = await sut.deleteAll();

    expect(result).toBe(true);
  });

  it("Should throw repository error if prisma throw error", async () => {
    mockCtx.prisma.customer.deleteMany.mockImplementation(() => {
      throw new PrismaClientKnownRequestError("Mock Error", {
        code: "P2022",
        clientVersion: "",
      });
    });

    try {
      const result = await sut.deleteAll();
    } catch (err) {
      expect(err).toBeInstanceOf(RepositoryError);
    }
  });

  it("Should throw internal server error if other error was thrown", async () => {
    mockCtx.prisma.customer.deleteMany.mockImplementation(() => {
      throw new Error();
    });
    try {
      const result = await sut.deleteAll();
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerError);
    }
  });
});
