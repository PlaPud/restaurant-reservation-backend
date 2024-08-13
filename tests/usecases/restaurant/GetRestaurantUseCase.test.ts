import { randomUUID } from "crypto";
import { Container } from "inversify";
import {
  GetRestaurantUseCase,
  IGetRestaurantDto,
  IGetRestaurantResult,
} from "../../../src/application/restaurant/GetRestaurantUseCase";
import { IRestaurantRepository } from "../../../src/infrastructure/interfaces/IRestaurantRepository";
import { RESTAURANT_T } from "../../../src/shared/inversify/restaurant.types";
import { IUseCase } from "../../../src/shared/IUseCase";
import { getMockedUUIDString } from "../../shared/mockUUID";
import { getMockRestaurant } from "../../shared/mockInstances";
import { Restaurant } from "../../../src/domain/Restaurant";
import { InternalServerError } from "../../../src/errors/HttpError";

let mockRestaurantRepo: jest.Mocked<IRestaurantRepository>;
let testContainer: Container;
let idCount: number;

let sut: IUseCase<IGetRestaurantDto, IGetRestaurantResult>;

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
    .bind<IUseCase<IGetRestaurantDto, IGetRestaurantResult>>(
      RESTAURANT_T.GetRestaurantUseCase
    )
    .to(GetRestaurantUseCase);

  (randomUUID as jest.Mock).mockReturnValue(getMockedUUIDString(idCount++));

  sut = testContainer.get<IUseCase<IGetRestaurantDto, IGetRestaurantResult>>(
    RESTAURANT_T.GetRestaurantUseCase
  );
};

const clearDown = () => {
  testContainer.unbindAll();
  idCount = 0;
};

describe("GetRestaurantUseCase", () => {
  beforeEach(() => {
    setUp();
  });

  afterEach(() => {
    clearDown();
  });

  it("Should return restaurant from repository with id.", async () => {
    const existedData: Restaurant = getMockRestaurant();

    const userInput: IGetRestaurantDto = {
      restaurantId: latestId(),
    };

    mockRestaurantRepo.find.mockImplementation(async (id: string) => {
      return existedData;
    });

    const result: IGetRestaurantResult = await sut.execute(userInput);

    expect(mockRestaurantRepo.find).toHaveBeenCalledWith(
      userInput.restaurantId
    );

    expect(result.restaurantId).toEqual(latestId());

    expect(result).toEqual(expect.objectContaining(existedData));
  });

  it("Should throw internal server error if result from repo is null", async () => {
    const existedData: Restaurant = getMockRestaurant();

    const userInput: IGetRestaurantDto = {
      restaurantId: latestId(),
    };

    mockRestaurantRepo.find.mockImplementation(async (id: string) => {
      return null;
    });

    const result: Promise<IGetRestaurantResult> = sut.execute(userInput);

    expect(mockRestaurantRepo.find).toHaveBeenCalledWith(
      userInput.restaurantId
    );

    await expect(result).rejects.toBeInstanceOf(InternalServerError);
  });
});
