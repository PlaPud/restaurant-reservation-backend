import { Reservation } from "../../domain/Reservation";
import {
  Restaurant,
  RestaurantJSONResponse,
  RestaurantObj,
} from "../../domain/Restaurant";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface ICreateReserveDto {
  restaurantId: string;
  seats: number;
  reservePrice: number;
  reserveDate: number;
}

export interface ICreateReserveResult {
  reserveId: string;
  restaurantId: string;
  lastModified: number;
  seats: number;
  reserveDate: number;
  restaurant: RestaurantJSONResponse;
}

export class CreateReserveUseCase
  implements IUseCase<ICreateReserveDto, ICreateReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(
    input: ICreateReserveDto
  ): Promise<ICreateReserveResult> {
    const newReserve = new Reservation({
      restaurantId: input.restaurantId,
      seats: input.seats,
      reserveDate: input.reserveDate,
      reservePrice: input.reservePrice,
    });

    const result = await this._repository.save(newReserve);

    if (!result) throw new InternalServerError();

    const body: ICreateReserveResult = {
      reserveId: result.reserveId,
      restaurantId: result.restaurantId,
      lastModified: result.lastModified,
      seats: result.seats,
      reserveDate: result.reserveDate,
      restaurant: result.restaurant
        ? result.restaurant.toJSONResponse()
        : ({} as RestaurantJSONResponse),
    };

    return body;
  }
}
