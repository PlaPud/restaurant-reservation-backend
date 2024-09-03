import { randomUUID } from "crypto";
import { Container } from "inversify";
import "reflect-metadata";
import {
  GetAllCustomerUseCase,
  IGetAllCustomerResult,
} from "../../../src/application/customer/GetAllCustomerUseCase";
import { Customer } from "../../../src/domain/Customer";
import { NotFoundError } from "../../../src/errors/HttpError";
import { ICustomerRepository } from "../../../src/infrastructure/interfaces/ICustomerRepository";
import { IUseCase } from "../../../src/shared/IUseCase";
import { CUSTOMER_T } from "../../../src/shared/inversify/customer.types";
import { getMockCustomer } from "../../shared/mockInstances";

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
      .bind<IUseCase<null, IGetAllCustomerResult>>(
        CUSTOMER_T.GetAllCustomerUseCase
      )
      .to(GetAllCustomerUseCase);

    useCase = testContainer.get<IUseCase<null, IGetAllCustomerResult>>(
      CUSTOMER_T.GetAllCustomerUseCase
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
    const createdCustomer = getMockCustomer();

    mockedCustomerRepo.findAll.mockResolvedValue([createdCustomer]);

    const result = await useCase.execute(null);

    expect(result.data).not.toBeNull();

    expect(result.data[0]).toEqual(createdCustomer.toObject());
  });
});
