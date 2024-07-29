import { inject, injectable } from "inversify";
import { NotFoundError } from "../../errors/HttpError";
import { ICustomerRepository } from "../../shared/ICustomerRepository";
import { IUseCase } from "../../shared/IUseCase";
import { TYPES } from "../../shared/types";

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
    @inject(TYPES.InMemoryCustomerRepository)
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
