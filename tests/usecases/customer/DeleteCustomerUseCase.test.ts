import "reflect-metadata";
import { ICustomerRepository } from "../../../src/infrastructure/interfaces/ICustomerRepository";
import { IUseCase } from "../../../src/shared/IUseCase";
import { Container } from "inversify";
import { CUSTOMER_T } from "../../../src/shared/inversify/customer.types";
import { randomUUID } from "crypto";
import { NotFoundError } from "../../../src/errors/HttpError";

import {
  DeleteCustomerUseCase,
  IDeleteCustomerDto,
  IDeleteCustomerResult,
} from "../../../src/application/customer/DeleteCustomerUseCase";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));
const getMockedUUIDString = (n: number) => `${n}-${n}-${n}-${n}-${n}`;

describe("DeleteCustomerUseCase", () => {
  let mockedCustomerRepo: jest.Mocked<ICustomerRepository>;
  let useCase: IUseCase<IDeleteCustomerDto, IDeleteCustomerResult>;
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
      .bind<ICustomerRepository>(CUSTOMER_T.InMemoryCustomerRepository)
      .toConstantValue(mockedCustomerRepo);

    testContainer
      .bind<IUseCase<IDeleteCustomerDto, IDeleteCustomerResult>>(
        CUSTOMER_T.DeleteCustomerUseCase
      )
      .to(DeleteCustomerUseCase);

    useCase = testContainer.get<
      IUseCase<IDeleteCustomerDto, IDeleteCustomerResult>
    >(CUSTOMER_T.DeleteCustomerUseCase);

    (randomUUID as jest.Mock).mockImplementation(() => {
      mockedUUID = getMockedUUIDString(idCount);
      idCount++;
      return mockedUUID;
    });
  });

  afterEach(() => {
    testContainer.unbindAll();
  });

  it("Should return true when customer deleted.", async () => {
    mockedCustomerRepo.delete.mockResolvedValue(true);

    const result = await useCase.execute({
      customerId: getMockedUUIDString(idCount),
    });

    expect(result.deletionComplete).toBe(true);
  });

  it("Should throw not found error if cannot delete.", async () => {
    mockedCustomerRepo.delete.mockResolvedValue(false);

    await expect(
      useCase.execute({
        customerId: getMockedUUIDString(idCount),
      })
    ).rejects.toThrow(NotFoundError);
  });
});
