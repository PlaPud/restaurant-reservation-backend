import { STATUS_CODES } from "http";
import { CustomerJSON } from "../../domain/Customer";
import { ICustomerRepository } from "../../shared/ICustomerRepository";
import { IUseCase } from "../../shared/IUseCase";
import { NotFoundError } from "../../errors/HttpError";
import { inject, injectable } from "inversify";
import { TYPES } from "../../shared/types";

export interface IGetAllCustomerResult {
  data: CustomerJSON[];
}

@injectable()
export class GetAllCustomerUseCase
  implements IUseCase<null, IGetAllCustomerResult>
{
  public constructor(
    @inject(TYPES.InMemoryCustomerRepository)
    private readonly _customerRepository: ICustomerRepository
  ) {}

  public async execute(): Promise<IGetAllCustomerResult> {
    const data = await this._customerRepository.findAll();

    if (!data) throw new NotFoundError();

    const results = data.map((c) => c.toJSON());

    return {
      data: results,
    };
  }
}
