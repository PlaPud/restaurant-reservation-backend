import { randomUUID } from "crypto";
import { Container } from "inversify";
import "reflect-metadata";
import {
  IUpdateRestaurantDto,
  IUpdateRestaurantResult,
  UpdateRestaurantUseCase,
} from "../../../src/application/restaurant/UpdateRestaurantUseCase";
import { Restaurant } from "../../../src/domain/Restaurant";
import { InternalServerError } from "../../../src/errors/HttpError";
import { IRestaurantRepository } from "../../../src/infrastructure/interfaces/IRestaurantRepository";
import { RESTAURANT_T } from "../../../src/shared/inversify/restaurant.types";
import { IUseCase } from "../../../src/shared/IUseCase";
import { getMockRestaurant } from "../../shared/mockInstances";
import { getMockedUUIDString } from "../../shared/mockUUID";

let mockRestaurantRepo: jest.Mocked<IRestaurantRepository>;
let testContainer: Container;
let idCount: number;

let sut: IUseCase<IUpdateRestaurantDto, IUpdateRestaurantResult>;

const latestId = () => getMockedUUIDString(idCount - 1);

const setUp = () => {
  mockRestaurantRepo = {
    find: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteAll: jest.fn(),
  } as jest.Mocked<IRestaurantRepository>;

  idCount = 0;
  testContainer = new Container();

  testContainer
    .bind<IRestaurantRepository>(RESTAURANT_T.InMemoryRestaurantRepository)
    .toConstantValue(mockRestaurantRepo);

  testContainer
    .bind<IUseCase<IUpdateRestaurantDto, IUpdateRestaurantResult>>(
      RESTAURANT_T.UpdateRestaurantUseCase
    )
    .to(UpdateRestaurantUseCase);

  (randomUUID as jest.Mock).mockReturnValue(getMockedUUIDString(idCount++));

  sut = testContainer.get<
    IUseCase<IUpdateRestaurantDto, IUpdateRestaurantResult>
  >(RESTAURANT_T.UpdateRestaurantUseCase);
};

const clearDown = () => {
  testContainer.unbindAll();
  idCount = 0;
};

describe("UpdateRestaurantUseCase", () => {
  beforeEach(() => {
    setUp();
  });

  afterEach(() => {
    clearDown();
  });

  it("Should return updated data successfully", async () => {
    const existedData = getMockRestaurant();

    const userInput: IUpdateRestaurantDto = {
      restaurantId: latestId(),
      data: {
        name: "newName",
        phone: existedData.phone,
        address: existedData.address,
      },
    };

    mockRestaurantRepo.update.mockResolvedValue(
      new Restaurant(
        userInput.restaurantId,
        userInput.data.name,
        userInput.data.phone,
        userInput.data.address
      )
    );

    const result: IUpdateRestaurantResult = await sut.execute(userInput);

    expect(result.restaurantId).toEqual(userInput.restaurantId);

    expect(result).toEqual(expect.objectContaining(userInput.data));
  });
  it("Should throw internal server error if repo returns null", async () => {
    const existedData = getMockRestaurant();

    const userInput: IUpdateRestaurantDto = {
      restaurantId: latestId(),
      data: {
        name: "newName",
        phone: existedData.phone,
        address: existedData.address,
      },
    };

    mockRestaurantRepo.update.mockResolvedValue(null);

    const result: Promise<IUpdateRestaurantResult> = sut.execute(userInput);

    await expect(result).rejects.toBeInstanceOf(InternalServerError);
  });
});
