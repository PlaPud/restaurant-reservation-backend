import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IDeleteAllReserveResult {
  deletionComplete: boolean;
}

export class DeleteAllReserveUseCase
  implements IUseCase<null, IDeleteAllReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}
  public async execute(input: null): Promise<IDeleteAllReserveResult> {
    const result = await this._repository.deleteAll();

    if (!result) throw new InternalServerError();

    const body: IDeleteAllReserveResult = {
      deletionComplete: result,
    };

    return body;
  }
}
