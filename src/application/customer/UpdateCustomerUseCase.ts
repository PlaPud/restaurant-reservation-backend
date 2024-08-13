import "reflect-metadata";
import { STATUS_CODES } from "http";
import { Customer } from "../../domain/Customer";
import { ICustomerRepository } from "../../shared/ICustomerRepository";
import { IUseCase } from "../../shared/IUseCase";
import { ICreateCustomerDto } from "./CreateCustomerUseCase";
import { BadRequestError, NotFoundError } from "../../errors/HttpError";
import { EntityNotFoundError } from "../../errors/DomainError";
import { inject, injectable } from "inversify";
import { TYPES } from "../../shared/types";

export interface IUpdateCustomerDto {
  customerId: string;

  data: ICreateCustomerDto;
}

export interface IUpdateCustomerResult {
  fName: string;

  lName: string;

  email: string;

  phone: string;
}

@injectable()
export class UpdateCustomerUseCase
  implements IUseCase<IUpdateCustomerDto, IUpdateCustomerResult>
{
  public constructor(
    @inject(TYPES.InMemoryCustomerRepository)
    private readonly _customerRepository: ICustomerRepository
  ) {}

  public async execute(
    input: IUpdateCustomerDto
  ): Promise<IUpdateCustomerResult> {
    const customer = new Customer(
      input.customerId,
      input.data.fName,
      input.data.lName,
      input.data.email,
      input.data.phone
    );

    const result = await this._customerRepository.update(
      input.customerId,
      customer
    );

    if (!result) throw new BadRequestError();

    const response = {
      fName: result.fName,
      lName: result.lName,
      email: result.email,
      phone: result.phone,
    };

    return response;
  }
}
