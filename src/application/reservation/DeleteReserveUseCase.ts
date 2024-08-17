import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IDeleteReserveDto {
  reserveId: string;
}

export interface IDeleteReserveResult {
  reserveId: string;
  deletionComplete: boolean;
}

export class DeleteReserveUseCase
  implements IUseCase<IDeleteReserveDto, IDeleteReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(
    input: IDeleteReserveDto
  ): Promise<IDeleteReserveResult> {
    const result = await this._repository.delete(input.reserveId);

    if (!result) throw new InternalServerError();

    const body: IDeleteReserveResult = {
      reserveId: input.reserveId,
      deletionComplete: result,
    };

    return body;
  }
}
