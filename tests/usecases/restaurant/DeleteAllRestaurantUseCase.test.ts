import { randomUUID } from "crypto";
import { Container } from "inversify";
import "reflect-metadata";
import {
  DeleteAllRestaurantUseCase,
  IDeleteAllRestaurantResult,
} from "../../../src/application/restaurant/DeleteAllRestaurantUseCase";
import { InternalServerError } from "../../../src/errors/HttpError";
import { IRestaurantRepository } from "../../../src/infrastructure/interfaces/IRestaurantRepository";
import { RESTAURANT_T } from "../../../src/shared/inversify/restaurant.types";
import { IUseCase } from "../../../src/shared/IUseCase";
import { getMockedUUIDString } from "../../shared/mockUUID";
let mockRestaurantRepo: jest.Mocked<IRestaurantRepository>;
let testContainer: Container;
let idCount: number;

let sut: IUseCase<null, IDeleteAllRestaurantResult>;

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
    .bind<IUseCase<null, IDeleteAllRestaurantResult>>(
      RESTAURANT_T.DeleteAllRestaurantUseCase
    )
    .to(DeleteAllRestaurantUseCase);

  (randomUUID as jest.Mock).mockReturnValue(getMockedUUIDString(idCount++));

  sut = testContainer.get<IUseCase<null, IDeleteAllRestaurantResult>>(
    RESTAURANT_T.DeleteAllRestaurantUseCase
  );
};

const clearDown = () => {
  testContainer.unbindAll();
  idCount = 0;
};

describe("DeleteAllRestaurantUseCase", () => {
  beforeEach(() => {
    setUp();
  });

  afterEach(() => {
    clearDown();
  });

  it("Should return deletionComplete to be true", async () => {
    mockRestaurantRepo.deleteAll.mockResolvedValue(true);

    const result: IDeleteAllRestaurantResult = await sut.execute(null);

    expect(result.deletionComplete).toBeTruthy();
  });

  it("Should throw internal server error if repo return false", async () => {
    mockRestaurantRepo.deleteAll.mockResolvedValue(false);

    const result: Promise<IDeleteAllRestaurantResult> = sut.execute(null);

    await expect(result).rejects.toBeInstanceOf(InternalServerError);
  });
});
