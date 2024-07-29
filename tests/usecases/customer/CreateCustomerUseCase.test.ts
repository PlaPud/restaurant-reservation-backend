import { randomUUID } from "crypto";
import { Container } from "inversify";
import "reflect-metadata";
import {
  CreateCustomerUseCase,
  ICreateCustomerDto,
  ICreateCustomerResult,
} from "../../../src/application/customer/CreateCustomerUseCase";
import { Customer } from "../../../src/domain/Customer";
import { BadRequestError } from "../../../src/errors/HttpError";
import { ICustomerRepository } from "../../../src/shared/ICustomerRepository";
import { IUseCase } from "../../../src/shared/IUseCase";
import { TYPES } from "../../../src/shared/types";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

const getMockedUUIDString = (n: number) => `${n}-${n}-${n}-${n}-${n}`;

describe("CreateCustomerUseCase", () => {
  let mockedCustomerRepo: jest.Mocked<ICustomerRepository>;
  let useCase: IUseCase<ICreateCustomerDto, ICreateCustomerResult>;
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
      .bind<IUseCase<ICreateCustomerDto, ICreateCustomerResult>>(
        TYPES.CreateCustomerUseCase
      )
      .to(CreateCustomerUseCase);

    useCase = testContainer.get<
      IUseCase<ICreateCustomerDto, ICreateCustomerResult>
    >(TYPES.CreateCustomerUseCase);

    (randomUUID as jest.Mock).mockImplementation(() => {
      mockedUUID = getMockedUUIDString(idCount);
      idCount++;
      return mockedUUID;
    });
  });

  afterEach(() => {
    testContainer.unbindAll();
  });

  it("Should return the same customerId", async () => {
    const input: ICreateCustomerDto = {
      fName: "John",
      lName: "Doe",
      email: "john.d@mail.com",
      phone: "12345",
    };

    mockedCustomerRepo.save.mockResolvedValue(true);

    const result = await useCase.execute(input);

    expect(mockedCustomerRepo.save).toHaveBeenCalledWith(expect.any(Customer));
    expect(result.customerId).toBe(getMockedUUIDString(idCount - 1));
  });

  it("Should throw bad request error when can't save", async () => {
    const input: ICreateCustomerDto = {
      fName: "John",
      lName: "Doe",
      email: "john.d@mail.com",
      phone: "12345",
    };

    mockedCustomerRepo.save.mockResolvedValue(false);

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestError);
  });
});
