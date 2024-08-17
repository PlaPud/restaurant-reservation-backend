import "reflect-metadata";
import { randomUUID } from "crypto";
import { Customer } from "../../domain/Customer";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { IUseCase } from "../../shared/IUseCase";
import { STATUS_CODES } from "http";
import { BadRequestError } from "../../errors/HttpError";
import { inject, injectable } from "inversify";
import { CUSTOMER_T } from "../../shared/inversify/customer.types";

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
    @inject(CUSTOMER_T.InMemoryCustomerRepository)
    private readonly _customerRepository: ICustomerRepository
  ) {}

  public async execute(
    input: ICreateCustomerDto
  ): Promise<ICreateCustomerResult> {
    const customer = new Customer({
      fName: input.fName,
      lName: input.lName,
      email: input.email,
      phone: input.phone,
    });

    const result = await this._customerRepository.save(customer);

    if (!result) throw new BadRequestError();

    return {
      customerId: customer.customerId,
    };
  }
}
