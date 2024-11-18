import { Container, id } from "inversify";
import {
  CreateRestaurantUseCase,
  ICreateRestaurantDto,
  ICreateRestaurantResult,
} from "../../../src/application/restaurant/CreateRestaurantUseCase";
import { IRestaurantRepository } from "../../../src/infrastructure/interfaces/IRestaurantRepository";
import { IUseCase } from "../../../src/shared/IUseCase";
import "../../shared/mockUUID";
import "reflect-metadata";
import { RESTAURANT_T } from "../../../src/shared/inversify/restaurant.types";
import { randomUUID } from "crypto";
import { getMockedUUIDString } from "../../shared/mockUUID";
import { faker } from "@faker-js/faker";
import { Restaurant } from "../../../src/domain/Restaurant";
import { InternalServerError } from "../../../src/errors/HttpError";
import { hash } from "bcrypt";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

let mockRestaurantRepo: jest.Mocked<IRestaurantRepository>;
let testContainer: Container;
let idCount: number;

let sut: IUseCase<ICreateRestaurantDto, ICreateRestaurantResult>;

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
    .bind<IUseCase<ICreateRestaurantDto, ICreateRestaurantResult>>(
      RESTAURANT_T.CreateRestaurantUseCase
    )
    .to(CreateRestaurantUseCase);

  (randomUUID as jest.Mock).mockReturnValue(getMockedUUIDString(idCount++));
  (hash as jest.Mock).mockImplementation(async (data: string, saltOrRounds) => {
    return data;
  });
  sut = testContainer.get<
    IUseCase<ICreateRestaurantDto, ICreateRestaurantResult>
  >(RESTAURANT_T.CreateRestaurantUseCase);
};

const clearDown = () => {
  testContainer.unbindAll();
  idCount = 0;
};

describe("CreateRestaurantUseCase", () => {
  beforeEach(() => {
    setUp();
  });

  afterEach(() => {
    clearDown();
  });

  it("Should Create and return the result from repo successfully", async () => {
    const userInput: ICreateRestaurantDto = {
      name: faker.company.name(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({ length: 32 }),
      subDistrict: faker.location.street(),
      district: faker.location.city(),
      province: faker.location.state(),
    };

    mockRestaurantRepo.save.mockImplementation(async (rs: Restaurant) => {
      return new Restaurant({
        name: rs.name,
        phone: rs.phone,
        address: rs.address,
        subDistrict: rs.subDistrict,
        district: rs.district,
        province: rs.province,
        email: rs.email,
        hashPassword: rs.hashPassword,
        isVerified: rs.isVerified,
      });
    });

    const result: ICreateRestaurantResult = await sut.execute(userInput);

    expect(result.restaurantId).toEqual(latestId());

    expect(result.name).toEqual(userInput.name);
  });

  it("Should throw internal server if result from repository is null", async () => {
    const userInput: ICreateRestaurantDto = {
      name: faker.company.name(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({ length: 32 }),
      subDistrict: faker.location.street(),
      district: faker.location.city(),
      province: faker.location.state(),
    };

    mockRestaurantRepo.save.mockImplementation(async (rs: Restaurant) => {
      return null;
    });

    const result: Promise<ICreateRestaurantResult> = sut.execute(userInput);
    await expect(result).rejects.toBeInstanceOf(InternalServerError);
  });
});
