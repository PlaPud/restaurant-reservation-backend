import { randomUUID } from "crypto";
import { Container } from "inversify";
import "reflect-metadata";
import {
  DeleteAllCustomerUseCase,
  IDeleteAllCustomerResult,
} from "../../../src/application/customer/DeleteAllCustomerUseCase";
import { BadRequestError } from "../../../src/errors/HttpError";
import { ICustomerRepository } from "../../../src/infrastructure/interfaces/ICustomerRepository";
import { IUseCase } from "../../../src/shared/IUseCase";
import { CUSTOMER_T } from "../../../src/shared/inversify/customer.types";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));
const getMockedUUIDString = (n: number) => `${n}-${n}-${n}-${n}-${n}`;

describe("DeleteAllCustomerUseCase", () => {
  let mockedCustomerRepo: jest.Mocked<ICustomerRepository>;
  let useCase: IUseCase<null, IDeleteAllCustomerResult>;
  let testContainer: Container;
  let mockedUUID: string;
  let idCount = 0;

  beforeEach(() => {
    mockedCustomerRepo = {
      find: jest.fn(),
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteAll: jest.fn(),
    } as jest.Mocked<ICustomerRepository>;

    testContainer = new Container();

    testContainer
      .bind<ICustomerRepository>(CUSTOMER_T.InMemoryCustomerRepository)
      .toConstantValue(mockedCustomerRepo);

    testContainer
      .bind<IUseCase<null, IDeleteAllCustomerResult>>(
        CUSTOMER_T.DeleteAllCustomerUseCase
      )
      .to(DeleteAllCustomerUseCase);

    useCase = testContainer.get<IUseCase<null, IDeleteAllCustomerResult>>(
      CUSTOMER_T.DeleteAllCustomerUseCase
    );

    (randomUUID as jest.Mock).mockImplementation(() => {
      mockedUUID = getMockedUUIDString(idCount);
      idCount++;
      return mockedUUID;
    });
  });

  afterEach(() => {
    testContainer.unbindAll();
  });

  it("Should return true when all customers deleted.", async () => {
    mockedCustomerRepo.deleteAll.mockResolvedValue(true);

    const result = await useCase.execute(null);

    expect(result.deletionComplete).toBe(true);
  });

  it("Should throw bad request error if cannot delete.", async () => {
    mockedCustomerRepo.deleteAll.mockResolvedValue(false);

    await expect(useCase.execute(null)).rejects.toThrow(BadRequestError);
  });
});
