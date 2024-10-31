import { ReservationJSONResponse } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IMakeReserveDto {
  customerId: string;
  reserveId: string;
}

export interface IMakeReserveResult {
  data: ReservationJSONResponse;
}

export class MakeReserveUseCase
  implements IUseCase<IMakeReserveDto, IMakeReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(input: IMakeReserveDto): Promise<IMakeReserveResult> {
    const result = await this._repository.makeReservation(
      input.reserveId,
      input.customerId
    );

    if (!result) throw new InternalServerError();

    const body: IMakeReserveResult = {
      data: result.toObject(),
    };

    return body;
  }
}
