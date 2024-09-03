import { randomUUID } from "crypto";
import { Container } from "inversify";
import "reflect-metadata";
import {
  GetAllRestaurantUseCase,
  IGetAllRestaurantResult,
} from "../../../src/application/restaurant/GetAllRestaurantUseCase";
import { IRestaurantRepository } from "../../../src/infrastructure/interfaces/IRestaurantRepository";
import { RESTAURANT_T } from "../../../src/shared/inversify/restaurant.types";
import { IUseCase } from "../../../src/shared/IUseCase";
import { getMockRestaurant } from "../../shared/mockInstances";
import { getMockedUUIDString } from "../../shared/mockUUID";
import { IGetAllCustomerResult } from "../../../src/application/customer/GetAllCustomerUseCase";
import { InternalServerError } from "../../../src/errors/HttpError";
let mockRestaurantRepo: jest.Mocked<IRestaurantRepository>;
let testContainer: Container;
let idCount: number;

let sut: IUseCase<null, IGetAllRestaurantResult>;

const latestId = () => getMockedUUIDString(idCount - 1);

const setUp = () => {
  mockRestaurantRepo = {
    find: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
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
    .bind<IUseCase<null, IGetAllRestaurantResult>>(
      RESTAURANT_T.GetAllRestaurantUseCase
    )
    .to(GetAllRestaurantUseCase);

  (randomUUID as jest.Mock).mockReturnValue(getMockedUUIDString(idCount++));

  sut = testContainer.get<IUseCase<null, IGetAllRestaurantResult>>(
    RESTAURANT_T.GetAllRestaurantUseCase
  );
};

const clearDown = () => {
  testContainer.unbindAll();
  idCount = 0;
};

describe("GetAllRestaurantUseCase", () => {
  beforeEach(() => {
    setUp();
  });

  afterEach(() => {
    clearDown();
  });

  it("Should return all restaurants as JSON.", async () => {
    const existedData = [getMockRestaurant()];

    mockRestaurantRepo.findAll.mockResolvedValue(existedData);

    const result: IGetAllRestaurantResult = await sut.execute(null);

    expect(result.data[0]).toEqual(
      expect.objectContaining(existedData[0].toObject())
    );
  });

  it("Should throw error if result from repo is null", async () => {
    mockRestaurantRepo.findAll.mockResolvedValue(null);

    const result: Promise<IGetAllRestaurantResult> = sut.execute(null);

    await expect(result).rejects.toBeInstanceOf(InternalServerError);
  });
});
