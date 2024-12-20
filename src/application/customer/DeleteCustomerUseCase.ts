import "reflect-metadata";
import { inject, injectable } from "inversify";
import { NotFoundError } from "../../errors/HttpError";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { IUseCase } from "../../shared/IUseCase";
import { CUSTOMER_T } from "../../shared/inversify/customer.types";

export interface IDeleteCustomerDto {
  customerId: string;
}

export interface IDeleteCustomerResult {
  deletionComplete: boolean;
}

@injectable()
export class DeleteCustomerUseCase
  implements IUseCase<IDeleteCustomerDto, IDeleteCustomerResult>
{
  public constructor(
    @inject(CUSTOMER_T.InMemoryCustomerRepository)
    private readonly _customerRepository: ICustomerRepository
  ) {}

  public async execute(
    input: IDeleteCustomerDto
  ): Promise<IDeleteCustomerResult> {
    const result = await this._customerRepository.delete(input.customerId);

    if (!result) throw new NotFoundError();

    return { deletionComplete: true };
  }
}
