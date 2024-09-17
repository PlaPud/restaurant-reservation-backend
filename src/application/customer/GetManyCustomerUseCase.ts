import "reflect-metadata";
import { STATUS_CODES } from "http";
import { CustomerObj, CustomerJSONResponse } from "../../domain/Customer";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { IUseCase } from "../../shared/IUseCase";
import { InternalServerError, NotFoundError } from "../../errors/HttpError";
import { inject, injectable } from "inversify";
import { CUSTOMER_T } from "../../shared/inversify/customer.types";

export interface IGetManyCustomerResult {
  page: number;
  data: CustomerJSONResponse[];
}

@injectable()
export class GetManyCustomerUseCase
  implements IUseCase<null, IGetManyCustomerResult>
{
  private _page = 1;

  public constructor(
    @inject(CUSTOMER_T.InMemoryCustomerRepository)
    private readonly _customerRepository: ICustomerRepository
  ) {}

  public setPagination(page: number) {
    this._page = page ? page : this._page;
  }

  public async execute(): Promise<IGetManyCustomerResult> {
    const data = await this._customerRepository.findMany(this._page);

    if (!data) throw new InternalServerError();

    const results = data.map((c) => c.toJSONResponse());

    return {
      page: this._page,
      data: results,
    };
  }
}
