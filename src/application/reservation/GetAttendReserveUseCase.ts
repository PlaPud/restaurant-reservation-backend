import { ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IGetAttendReserveDto {
  restaurantId: string;
}

export interface IGetAttendReserveResult {
  data: ReservationObj[];
}

export class GetAttendReserveUseCase
  implements IUseCase<IGetAttendReserveDto, IGetAttendReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}
  public async execute(
    input: IGetAttendReserveDto
  ): Promise<IGetAttendReserveResult> {
    const result = await this._repository.findAttendReserves(
      input.restaurantId
    );

    if (!result) throw new InternalServerError();

    const body: IGetAttendReserveResult = {
      data: result.map((r) => r.toObject()),
    };

    return body;
  }
}
