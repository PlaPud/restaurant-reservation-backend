import { randomUUID } from "crypto";
import { Container } from "inversify";
import "reflect-metadata";
import {
  GetManyCustomerUseCase,
  IGetManyCustomerResult,
} from "../../../src/application/customer/GetManyCustomerUseCase";
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
  let useCase: IUseCase<null, IGetManyCustomerResult>;
  let testContainer: Container;
  let mockedUUID: string;
  let idCount = 0;

  beforeEach(() => {
    mockedCustomerRepo = {
      find: jest.fn(),
      findMany: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      updateProfileImgPath: jest.fn(),
      delete: jest.fn(),
      deleteAll: jest.fn(),
    } as jest.Mocked<ICustomerRepository>;

    testContainer = new Container();

    testContainer
      .bind<ICustomerRepository>(CUSTOMER_T.InMemoryCustomerRepository)
      .toConstantValue(mockedCustomerRepo);

    testContainer
      .bind<IUseCase<null, IGetManyCustomerResult>>(
        CUSTOMER_T.GetAllCustomerUseCase
      )
      .to(GetManyCustomerUseCase);

    useCase = testContainer.get<IUseCase<null, IGetManyCustomerResult>>(
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

    mockedCustomerRepo.findMany.mockResolvedValue([createdCustomer]);

    const result = await useCase.execute(null);

    expect(result.data).not.toBeNull();

    expect(result.data[0]).toEqual(createdCustomer.toJSONResponse());
  });
});
