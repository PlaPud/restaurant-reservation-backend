import { CustomerObj } from "../../domain/Customer";
import {
  Reservation,
  ReservationJSONResponse,
  ReservationObj,
} from "../../domain/Reservation";
import { RestaurantObj } from "../../domain/Restaurant";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IUpdateReserveDto {
  reserveId: string;
  data: {
    customerId: string;
    restaurantId: string;
    seats: number;
    reserveDate: string;
    payImgUrl: string;
    isPayed: boolean;
    isAttended: boolean;
  };
}

export interface IUpdateReserveResult extends ReservationJSONResponse {}

export class UpdateReserveUseCase
  implements IUseCase<IUpdateReserveDto, IUpdateReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(
    input: IUpdateReserveDto
  ): Promise<IUpdateReserveResult> {
    const updatedData = new Reservation({
      reserveId: input.reserveId,
      restaurantId: input.data.restaurantId,
      customerId: input.data.customerId,
      seats: input.data.seats,
      reserveDate: input.data.reserveDate,
      payImgUrl: input.data.payImgUrl,
      isPayed: input.data.isPayed,
      isAttended: input.data.isAttended,
    });

    const result = await this._repository.update(input.reserveId, updatedData);

    if (!result) throw new InternalServerError();

    const body: IUpdateReserveResult = result.toJSONResponse();

    return body;
  }
}
