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
import { hash } from "bcrypt";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

let mockRestaurantRepo: jest.Mocked<IRestaurantRepository>;
let testContainer: Container;
let idCount: number;

let sut: IUseCase<IUpdateRestaurantDto, IUpdateRestaurantResult>;

const latestId = () => getMockedUUIDString(idCount - 1);

const setUp = () => {
  mockRestaurantRepo = {
    find: jest.fn(),
    findMany: jest.fn(),
    findByEmail: jest.fn(),
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
    .bind<IUseCase<IUpdateRestaurantDto, IUpdateRestaurantResult>>(
      RESTAURANT_T.UpdateRestaurantUseCase
    )
    .to(UpdateRestaurantUseCase);

  (randomUUID as jest.Mock).mockReturnValue(getMockedUUIDString(idCount++));

  (hash as jest.Mock).mockImplementation((s: string) => s);

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
        email: existedData.email,
        password: existedData.hashPassword,
        subDistrict: "",
        district: "",
        province: "",
        description: "",
      },
    };

    mockRestaurantRepo.update.mockResolvedValue(
      new Restaurant({
        restaurantId: userInput.restaurantId,
        name: userInput.data.name,
        phone: userInput.data.phone,
        address: userInput.data.address,
        email: userInput.data.email,
        hashPassword: userInput.data.password,
        subDistrict: "",
        district: "",
        province: "",
        description: "",
      })
    );

    const result: IUpdateRestaurantResult = await sut.execute(userInput);

    expect(result.restaurantId).toEqual(userInput.restaurantId);

    expect(result.name).toEqual(userInput.data.name);
  });
  it("Should throw internal server error if repo returns null", async () => {
    const existedData = getMockRestaurant();

    const userInput: IUpdateRestaurantDto = {
      restaurantId: latestId(),
      data: {
        name: "newName",
        phone: existedData.phone,
        address: existedData.address,
        email: existedData.email,
        password: existedData.hashPassword,
        subDistrict: "",
        district: "",
        province: "",
        description: "",
      },
    };

    mockRestaurantRepo.update.mockResolvedValue(null);

    const result: Promise<IUpdateRestaurantResult> = sut.execute(userInput);

    await expect(result).rejects.toBeInstanceOf(InternalServerError);
  });
});
