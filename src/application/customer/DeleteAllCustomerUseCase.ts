import "reflect-metadata";
import { inject, injectable } from "inversify";
import { BadRequestError } from "../../errors/HttpError";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { IUseCase } from "../../shared/IUseCase";
import { CUSTOMER_T } from "../../shared/inversify/customer.types";

export interface IDeleteAllCustomerResult {
  deletionComplete: boolean;
}

@injectable()
export class DeleteAllCustomerUseCase
  implements IUseCase<null, IDeleteAllCustomerResult>
{
  public constructor(
    @inject(CUSTOMER_T.InMemoryCustomerRepository)
    private readonly _customerRepository: ICustomerRepository
  ) {}

  public async execute(): Promise<IDeleteAllCustomerResult> {
    const result = await this._customerRepository.deleteAll();

    if (!result) throw new BadRequestError();

    return { deletionComplete: result };
  }
}
