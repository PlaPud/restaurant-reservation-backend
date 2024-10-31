import "reflect-metadata";
import { randomUUID } from "crypto";

import { IUseCase } from "../../../src/shared/IUseCase";
import { CUSTOMER_T } from "../../../src/shared/inversify/customer.types";
import { ICustomerRepository } from "../../../src/infrastructure/interfaces/ICustomerRepository";
import { Container } from "inversify";
import {
  IUpdateCustomerDto,
  IUpdateCustomerResult,
  UpdateCustomerUseCase,
} from "../../../src/application/customer/UpdateCustomerUseCase";
import { Customer } from "../../../src/domain/Customer";
import { BadRequestError } from "../../../src/errors/HttpError";
import { getMockCustomer } from "../../shared/mockInstances";

import { hash } from "bcrypt";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

const getMockedUUIDString = (n: number) => `${n}-${n}-${n}-${n}-${n}`;

describe("UpdateCustomerUseCase", () => {
  let mockedCustomerRepo: jest.Mocked<ICustomerRepository>;
  let useCase: IUseCase<IUpdateCustomerDto, IUpdateCustomerResult>;
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
      .bind<IUseCase<IUpdateCustomerDto, IUpdateCustomerResult>>(
        CUSTOMER_T.UpdateCustomerUseCase
      )
      .to(UpdateCustomerUseCase);

    useCase = testContainer.get<
      IUseCase<IUpdateCustomerDto, IUpdateCustomerResult>
    >(CUSTOMER_T.UpdateCustomerUseCase);

    (randomUUID as jest.Mock).mockImplementation(() => {
      mockedUUID = getMockedUUIDString(idCount);
      idCount++;
      return mockedUUID;
    });

    (hash as jest.Mock).mockImplementation(
      async (data: string, saltOrRounds) => {
        return data;
      }
    );
  });

  afterEach(() => {
    testContainer.unbindAll();
  });

  it("Should update customer's data to be like input.", async () => {
    const customer = getMockCustomer();

    const input: IUpdateCustomerDto = {
      customerId: customer.customerId,
      data: {
        fName: "Jane",
        lName: customer.lName,
        email: customer.email,
        phone: customer.phone,
        password: customer.hashPassword,
      },
    };

    mockedCustomerRepo.update.mockImplementation(
      async (id: string, data: Customer) => {
        return new Customer({
          customerId: id,
          fName: data.fName,
          lName: data.lName,
          email: data.email,
          phone: data.phone,
          reservation: data.reservation,
          hashPassword: data.hashPassword,
        });
      }
    );

    const result: IUpdateCustomerResult = await useCase.execute(input);

    expect(result.fName).toEqual(input.data.fName);
  });

  it("Should throw bad request error if cannot update.", async () => {
    const customer = getMockCustomer();

    const input: IUpdateCustomerDto = {
      customerId: customer.customerId,
      data: {
        fName: "Jane",
        lName: customer.lName,
        email: customer.email,
        phone: customer.phone,
        password: customer.hashPassword,
      },
    };

    mockedCustomerRepo.update.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestError);
  });
});
