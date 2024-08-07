import { Restaurant } from "../../domain/Restaurant";
import { InternalServerError } from "../../errors/HttpError";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IUpdateRestaurantDto {
  restaurantId: string;
  data: {
    name: string;
    phone: string;
    address: string;
  };
}

export interface IUpdateRestaurantResult {
  restaurantId: string;
  name: string;
  phone: string;
  address: string;
}

export interface IUpdateRestaurantUseCase
  extends IUseCase<IUpdateRestaurantDto, IUpdateRestaurantResult> {
  execute(input: IUpdateRestaurantDto): Promise<IUpdateRestaurantResult>;
}

export class UpdateRestaurantUseCase implements IUpdateRestaurantUseCase {
  public constructor(private readonly _repository: IRestaurantRepository) {}

  public async execute(
    input: IUpdateRestaurantDto
  ): Promise<IUpdateRestaurantResult> {
    const restaurant = new Restaurant(
      input.restaurantId,
      input.data.name,
      input.data.phone,
      input.data.address
    );

    const result = await this._repository.update(
      input.restaurantId,
      restaurant
    );

    if (!result) throw new InternalServerError();

    const body: IUpdateRestaurantResult = {
      restaurantId: input.restaurantId,
      name: result.name,
      phone: result.phone,
      address: result.address,
    };

    return body;
  }
}
