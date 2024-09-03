import "reflect-metadata";
import { STATUS_CODES } from "http";
import { Customer } from "../../domain/Customer";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { IUseCase } from "../../shared/IUseCase";
import { ICreateCustomerDto } from "./CreateCustomerUseCase";
import { BadRequestError, NotFoundError } from "../../errors/HttpError";
import { EntityNotFoundError } from "../../errors/DomainError";
import { inject, injectable } from "inversify";
import { CUSTOMER_T } from "../../shared/inversify/customer.types";
import bcrypt from "bcrypt";
export interface IUpdateCustomerDto {
  customerId: string;

  data: {
    fName: string;

    lName: string;

    email: string;

    phone: string;

    password: string | Buffer;
  };
}

export interface IUpdateCustomerResult {
  customerId: string;

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
    @inject(CUSTOMER_T.InMemoryCustomerRepository)
    private readonly _customerRepository: ICustomerRepository
  ) {}

  public async execute(
    input: IUpdateCustomerDto
  ): Promise<IUpdateCustomerResult> {
    const hashPassword = await bcrypt.hash(input.data.password, 10);

    input.data.password = "";

    const customer = new Customer({
      customerId: input.customerId,
      fName: input.data.fName,
      lName: input.data.lName,
      email: input.data.email,
      phone: input.data.phone,
      hashPassword,
    });

    const result = await this._customerRepository.update(
      input.customerId,
      customer
    );

    if (!result) throw new BadRequestError();

    const response = {
      customerId: input.customerId,
      fName: result.fName,
      lName: result.lName,
      email: result.email,
      phone: result.phone,
    };

    return response;
  }
}
