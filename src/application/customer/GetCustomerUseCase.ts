import "reflect-metadata";
import { STATUS_CODES } from "http";
import { CustomerJSONResponse, CustomerObj } from "../../domain/Customer";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { IUseCase } from "../../shared/IUseCase";
import { InternalServerError, NotFoundError } from "../../errors/HttpError";
import { inject, injectable } from "inversify";
import { CUSTOMER_T } from "../../shared/inversify/customer.types";

export interface IGetCustomerDto {
  customerId: string;
}

export interface IGetCustomerResult extends CustomerJSONResponse {}

@injectable()
export class GetCustomerUseCase
  implements IUseCase<IGetCustomerDto, IGetCustomerResult>
{
  public constructor(
    @inject(CUSTOMER_T.InMemoryCustomerRepository)
    private readonly _customerRepository: ICustomerRepository
  ) {}

  public async execute(input: IGetCustomerDto): Promise<IGetCustomerResult> {
    const result = await this._customerRepository.find(input.customerId);

    if (!result) throw new InternalServerError();

    return result.toJSONResponse();
  }
}
