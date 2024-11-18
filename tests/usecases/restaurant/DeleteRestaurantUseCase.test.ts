import { randomUUID } from "crypto";
import { Container } from "inversify";
import "reflect-metadata";
import {
  DeleteRestaurantUseCase,
  IDeleteRestaurantDto,
  IDeleteRestaurantResult,
} from "../../../src/application/restaurant/DeleteRestaurantUseCase";
import { InternalServerError } from "../../../src/errors/HttpError";
import { IRestaurantRepository } from "../../../src/infrastructure/interfaces/IRestaurantRepository";
import { RESTAURANT_T } from "../../../src/shared/inversify/restaurant.types";
import { IUseCase } from "../../../src/shared/IUseCase";
import { getMockRestaurant } from "../../shared/mockInstances";
import { getMockedUUIDString } from "../../shared/mockUUID";
let mockRestaurantRepo: jest.Mocked<IRestaurantRepository>;
let testContainer: Container;
let idCount: number;

let sut: IUseCase<IDeleteRestaurantDto, IDeleteRestaurantResult>;

const latestId = () => getMockedUUIDString(idCount - 1);

const setUp = () => {
  mockRestaurantRepo = {
    find: jest.fn(),
    findMany: jest.fn(),
    findByEmail: jest.fn(),
    getRecordsCount: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    updateProfileImgPath: jest.fn(),
    delete: jest.fn(),
    deleteAll: jest.fn(),
  } as jest.Mocked<IRestaurantRepository>;

  idCount = 0;
  testContainer = new Container();

  testContainer
    .bind<IRestaurantRepository>(RESTAURANT_T.InMemoryRestaurantRepository)
    .toConstantValue(mockRestaurantRepo);

  testContainer
    .bind<IUseCase<IDeleteRestaurantDto, IDeleteRestaurantResult>>(
      RESTAURANT_T.DeleteRestaurantUseCase
    )
    .to(DeleteRestaurantUseCase);

  (randomUUID as jest.Mock).mockReturnValue(getMockedUUIDString(idCount++));

  sut = testContainer.get<
    IUseCase<IDeleteRestaurantDto, IDeleteRestaurantResult>
  >(RESTAURANT_T.DeleteRestaurantUseCase);
};

const clearDown = () => {
  testContainer.unbindAll();
  idCount = 0;
};

describe("DeleteRestaurantUseCase", () => {
  beforeEach(() => {
    setUp();
  });

  afterEach(() => {
    clearDown();
  });

  it("Should return deletion result with id successful", async () => {
    const deleteRestaurant = getMockRestaurant();

    const userInput: IDeleteRestaurantDto = {
      restaurantId: latestId(),
    };

    mockRestaurantRepo.delete.mockImplementation(async (id: string) => {
      return true;
    });

    const result: IDeleteRestaurantResult = await sut.execute(userInput);

    expect(mockRestaurantRepo.delete).toHaveBeenCalledWith(
      userInput.restaurantId
    );

    expect(result.deletionComplete).toBeTruthy();

    expect(result.deletedId).toBe(deleteRestaurant.restaurantId);
  });

  it("Should throw internal server error if result from repo is null", async () => {
    const deleteRestaurant = getMockRestaurant();

    const userInput: IDeleteRestaurantDto = {
      restaurantId: deleteRestaurant.restaurantId,
    };

    mockRestaurantRepo.delete.mockImplementation(async (id: string) => false);

    const result: Promise<IDeleteRestaurantResult> = sut.execute(userInput);

    await expect(result).rejects.toBeInstanceOf(InternalServerError);
  });
});
