import "reflect-metadata";
import { ICustomerRepository } from "../../../src/infrastructure/interfaces/ICustomerRepository";
import { IUseCase } from "../../../src/shared/IUseCase";
import { Container } from "inversify";
import { Customer, CustomerJSON } from "../../../src/domain/Customer";
import { TYPES } from "../../../src/shared/types";
import { randomUUID } from "crypto";
import {
  GetCustomerUseCase,
  IGetCustomerDto,
} from "../../../src/application/customer/GetCustomerUseCase";
import { NotFoundError } from "../../../src/errors/HttpError";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

const getMockedUUIDString = (n: number) => `${n}-${n}-${n}-${n}-${n}`;

describe("GetCustomerUseCase", () => {
  let mockedCustomerRepo: jest.Mocked<ICustomerRepository>;
  let useCase: IUseCase<IGetCustomerDto, CustomerJSON>;
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
      .bind<IUseCase<IGetCustomerDto, CustomerJSON>>(TYPES.GetCustomerUseCase)
      .to(GetCustomerUseCase);

    useCase = testContainer.get<IUseCase<IGetCustomerDto, CustomerJSON>>(
      TYPES.GetCustomerUseCase
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

  it("Should return customer that has the same customerID.", async () => {
    const createdCustomer = new Customer(
      undefined,
      "John",
      "Doe",
      "john.d@mail.com",
      "12345"
    );

    mockedCustomerRepo.find.mockResolvedValue(createdCustomer);

    const result = await useCase.execute({
      customerId: getMockedUUIDString(idCount),
    });

    expect(mockedCustomerRepo.find).toHaveBeenCalledWith(
      expect.stringMatching(getMockedUUIDString(idCount))
    );
    expect(result.customerId).toBe(getMockedUUIDString(idCount - 1));
    expect(result).toMatchObject(createdCustomer);
  });

  it("Should throw not found error when result is null", async () => {
    mockedCustomerRepo.find.mockResolvedValue(null);

    expect(
      useCase.execute({ customerId: getMockedUUIDString(idCount) })
    ).rejects.toThrow(NotFoundError);
  });
});
