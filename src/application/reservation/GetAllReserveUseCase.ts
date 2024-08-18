import { Reservation, ReservationJSON } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IGetAllReserveResult {
  data: ReservationJSON[];
}

export class GetAllReserveUseCase
  implements IUseCase<null, IGetAllReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(input: null): Promise<IGetAllReserveResult> {
    const result = await this._repository.findAll();

    if (!result) throw new InternalServerError();

    const body: IGetAllReserveResult = {
      data: result.map((r) => r.toJSON()),
    };

    return body;
  }
}
