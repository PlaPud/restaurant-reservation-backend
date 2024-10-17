import { ReservationJSONResponse } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface ICancelReserveDto {
  reserveId: string;
}

export interface ICancelReserveResult {
  data: ReservationJSONResponse;
}

export class CancelReserveUseCase
  implements IUseCase<ICancelReserveDto, ICancelReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(
    input: ICancelReserveDto
  ): Promise<ICancelReserveResult> {
    const result = await this._repository.cancelReservation(input.reserveId);

    if (!result) throw new InternalServerError();

    const body: ICancelReserveResult = {
      data: result.toObject(),
    };

    return body;
  }
}
