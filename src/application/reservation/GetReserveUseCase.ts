import { Reservation, ReservationObj } from "../../domain/Reservation";
import { RestaurantObj } from "../../domain/Restaurant";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IGetReserveDto {
  reserveId: string;
}

export interface IGetReserveResult extends ReservationObj {}

export class GetReserveUseCase
  implements IUseCase<IGetReserveDto, IGetReserveResult>
{
  constructor(private readonly _repository: IReserveRepository) {}

  public async execute(input: IGetReserveDto): Promise<IGetReserveResult> {
    const result = await this._repository.find(input.reserveId);

    if (!result) throw new InternalServerError();

    const body: IGetReserveResult = result.toObject();

    return body;
  }
}
