import { hash } from "bcrypt";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Customer } from "../../domain/Customer";
import { BadRequestError } from "../../errors/HttpError";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { CUSTOMER_T } from "../../shared/inversify/customer.types";
import { IUseCase } from "../../shared/IUseCase";

export interface ICreateCustomerDto {
  fName: string;

  lName: string;

  email: string;

  phone: string;

  password: string | Buffer;
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
    const hashPassword = await hash(input.password, 10);

    input.password = "";

    const customer = new Customer({
      fName: input.fName,
      lName: input.lName,
      email: input.email,
      phone: input.phone,
      hashPassword,
    });

    const result = await this._customerRepository.save(customer);

    if (!result) throw new BadRequestError();

    return {
      customerId: customer.customerId,
    };
  }
}
