import { inject, injectable } from "inversify";
import "reflect-metadata";
import { InternalServerError } from "../../errors/HttpError";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { RESTAURANT_T } from "../../shared/inversify/restaurant.types";
import { IUseCase } from "../../shared/IUseCase";
import { ReservationJSONResponse } from "../../domain/Reservation";
export interface IGetRestaurantDto {
  restaurantId: string;
}

export interface IGetRestaurantResult {
  restaurantId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  profileImgPath: string;
  description: string;
  reservation?: ReservationJSONResponse[];
}

export interface IGetRestaurantUseCase
  extends IUseCase<IGetRestaurantDto, IGetRestaurantResult> {
  execute(input: IGetRestaurantDto): Promise<IGetRestaurantResult>;
}

@injectable()
export class GetRestaurantUseCase implements IGetRestaurantUseCase {
  constructor(
    @inject(RESTAURANT_T.InMemoryRestaurantRepository)
    private readonly _repository: IRestaurantRepository
  ) {}

  public async execute(
    input: IGetRestaurantDto
  ): Promise<IGetRestaurantResult> {
    const result = await this._repository.find(input.restaurantId);

    if (!result) {
      throw new InternalServerError();
    }

    const body = result.toObject();

    console.log(body);

    return body;
  }
}
