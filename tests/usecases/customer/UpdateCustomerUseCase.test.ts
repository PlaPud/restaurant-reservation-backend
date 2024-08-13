import "reflect-metadata";
import { randomUUID } from "crypto";

import { IUseCase } from "../../../src/shared/IUseCase";
import { TYPES } from "../../../src/shared/types";
import { ICustomerRepository } from "../../../src/shared/ICustomerRepository";
import { Container } from "inversify";
import {
  IUpdateCustomerDto,
  IUpdateCustomerResult,
  UpdateCustomerUseCase,
} from "../../../src/application/customer/UpdateCustomerUseCase";
import { Customer } from "../../../src/domain/Customer";
import { BadRequestError } from "../../../src/errors/HttpError";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
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
      .bind<IUseCase<IUpdateCustomerDto, IUpdateCustomerResult>>(
        TYPES.UpdateCustomerUseCase
      )
      .to(UpdateCustomerUseCase);

    useCase = testContainer.get<
      IUseCase<IUpdateCustomerDto, IUpdateCustomerResult>
    >(TYPES.UpdateCustomerUseCase);

    (randomUUID as jest.Mock).mockImplementation(() => {
      mockedUUID = getMockedUUIDString(idCount);
      idCount++;
      return mockedUUID;
    });
  });

  afterEach(() => {
    testContainer.unbindAll();
  });

  it("Should update customer's data to be like input.", async () => {
    const customer = new Customer(
      "1",
      "John",
      "Doe",
      "john.d@email.com",
      "12345"
    );

    const input: IUpdateCustomerDto = {
      customerId: "1",
      data: {
        fName: "Jane",
        lName: customer.lName,
        email: customer.email,
        phone: customer.phone,
      },
    };

    mockedCustomerRepo.update.mockImplementation(
      async (id: string, data: Customer) => {
        return new Customer(
          id,
          data.fName,
          data.lName,
          data.email,
          data.phone,
          data.reservations
        );
      }
    );

    const result: IUpdateCustomerResult = await useCase.execute(input);

    expect(result.fName).toEqual(input.data.fName);
  });

  it("Should throw bad request error if cannot update.", async () => {
    const customer = new Customer(
      "1",
      "John",
      "Doe",
      "john.d@email.com",
      "12345"
    );

    const input: IUpdateCustomerDto = {
      customerId: "1",
      data: {
        fName: "Jane",
        lName: customer.lName,
        email: customer.email,
        phone: customer.phone,
      },
    };

    mockedCustomerRepo.update.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestError);
  });
});
