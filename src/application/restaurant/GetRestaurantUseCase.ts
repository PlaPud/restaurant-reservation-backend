import { Reservation } from "@prisma/client";
import { IUseCase } from "../../shared/IUseCase";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { InternalServerError, NotFoundError } from "../../errors/HttpError";

export interface IGetRestaurantDto {
  restaurantId: string;
}

export interface IGetRestaurantResult {
  restaurantId: string;
  name: string;
  phone: string;
  address: string;
  currentReserves?: Reservation[];
}

export interface IGetRestaurantUseCase
  extends IUseCase<IGetRestaurantDto, IGetRestaurantResult> {
  execute(input: IGetRestaurantDto): Promise<IGetRestaurantResult>;
}

export class GetRestaurantUseCase implements IGetRestaurantUseCase {
  constructor(private readonly _repository: IRestaurantRepository) {}

  public async execute(
    input: IGetRestaurantDto
  ): Promise<IGetRestaurantResult> {
    const result = await this._repository.find(input.restaurantId);

    if (!result) {
      throw new InternalServerError();
    }

    const body = result.toJSON();

    return body;
  }
}
