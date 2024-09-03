import "reflect-metadata";
import { STATUS_CODES } from "http";
import { CustomerObj, CustomerJSONResponse } from "../../domain/Customer";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { IUseCase } from "../../shared/IUseCase";
import { InternalServerError, NotFoundError } from "../../errors/HttpError";
import { inject, injectable } from "inversify";
import { CUSTOMER_T } from "../../shared/inversify/customer.types";

export interface IGetAllCustomerResult {
  data: CustomerJSONResponse[];
}

@injectable()
export class GetAllCustomerUseCase
  implements IUseCase<null, IGetAllCustomerResult>
{
  public constructor(
    @inject(CUSTOMER_T.InMemoryCustomerRepository)
    private readonly _customerRepository: ICustomerRepository
  ) {}

  public async execute(): Promise<IGetAllCustomerResult> {
    const data = await this._customerRepository.findAll();

    if (!data) throw new InternalServerError();

    const results = data.map((c) => c.toJSONResponse());

    return {
      data: results,
    };
  }
}
