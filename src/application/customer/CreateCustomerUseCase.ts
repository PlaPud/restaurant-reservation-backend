import { randomUUID } from "crypto";
import { Customer } from "../../domain/Customer";
import { ICustomerRepository } from "../../shared/ICustomerRepository";
import { IUseCase } from "../../shared/IUseCase";
import { STATUS_CODES } from "http";
import { BadRequestError } from "../../errors/HttpError";
import { inject, injectable } from "inversify";
import { TYPES } from "../../shared/types";

export interface ICreateCustomerDto {
  fName: string;

  lName: string;

  email: string;

  phone: string;
}

export interface ICreateCustomerResult {
  customerId: string;
}

@injectable()
export class CreateCustomerUseCase
  implements IUseCase<ICreateCustomerDto, ICreateCustomerResult>
{
  public constructor(
    @inject(TYPES.InMemoryCustomerRepository)
    private readonly _customerRepository: ICustomerRepository
  ) {}

  public async execute(
    input: ICreateCustomerDto
  ): Promise<ICreateCustomerResult> {
    const customer = new Customer(
      undefined,
      input.fName,
      input.lName,
      input.email,
      input.phone
    );

    const result = await this._customerRepository.save(customer);

    if (!result) throw new BadRequestError();

    return {
      customerId: customer.customerId,
    };
  }
}
