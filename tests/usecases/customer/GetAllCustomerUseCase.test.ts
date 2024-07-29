import { randomUUID } from "crypto";
import { Container } from "inversify";
import "reflect-metadata";
import {
  GetAllCustomerUseCase,
  IGetAllCustomerResult,
} from "../../../src/application/customer/GetAllCustomerUseCase";
import { Customer } from "../../../src/domain/Customer";
import { NotFoundError } from "../../../src/errors/HttpError";
import { ICustomerRepository } from "../../../src/shared/ICustomerRepository";
import { IUseCase } from "../../../src/shared/IUseCase";
import { TYPES } from "../../../src/shared/types";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

const getMockedUUIDString = (n: number) => `${n}-${n}-${n}-${n}-${n}`;

describe("GetAllCustomerUseCase", () => {
  let mockedCustomerRepo: jest.Mocked<ICustomerRepository>;
  let useCase: IUseCase<null, IGetAllCustomerResult>;
  let testContainer: Container;
  let mockedUUID: string;
  let idCount = 0;

  beforeEach(() => {
    mockedCustomerRepo = {
      find: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteAll: jest.fn(),
    } as jest.Mocked<ICustomerRepository>;

    testContainer = new Container();

    testContainer
      .bind<ICustomerRepository>(TYPES.InMemoryCustomerRepository)
      .toConstantValue(mockedCustomerRepo);

    testContainer
      .bind<IUseCase<null, IGetAllCustomerResult>>(TYPES.GetAllCustomerUseCase)
      .to(GetAllCustomerUseCase);

    useCase = testContainer.get<IUseCase<null, IGetAllCustomerResult>>(
      TYPES.GetAllCustomerUseCase
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

  it("Should return JSON result sucessfully", async () => {
    const createdCustomer = new Customer(
      undefined,
      "John",
      "Doe",
      "john.d@mail.com",
      "12345"
    );

    mockedCustomerRepo.findAll.mockResolvedValue([createdCustomer]);

    const result = await useCase.execute(null);

    expect(result.data).not.toBeNull();

    expect(result.data[0]).toEqual(Customer.fromJSON(createdCustomer));
  });

  it("Should throw not found error when result is null", async () => {
    mockedCustomerRepo.findAll.mockResolvedValue(null);

    await expect(useCase.execute(null)).rejects.toThrow(NotFoundError);
  });
});
