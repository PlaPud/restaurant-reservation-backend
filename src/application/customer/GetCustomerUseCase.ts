import "reflect-metadata";
import { STATUS_CODES } from "http";
import { CustomerJSON } from "../../domain/Customer";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { IUseCase } from "../../shared/IUseCase";
import { NotFoundError } from "../../errors/HttpError";
import { inject, injectable } from "inversify";
import { TYPES } from "../../shared/types";

export interface IGetCustomerDto {
  customerId: string;
}

@injectable()
export class GetCustomerUseCase
  implements IUseCase<IGetCustomerDto, CustomerJSON>
{
  public constructor(
    @inject(TYPES.InMemoryCustomerRepository)
    private readonly _customerRepository: ICustomerRepository
  ) {}

  public async execute(input: IGetCustomerDto): Promise<CustomerJSON> {
    const result = await this._customerRepository.find(input.customerId);

    if (!result) throw new NotFoundError();

    return result.toJSON();
  }
}
