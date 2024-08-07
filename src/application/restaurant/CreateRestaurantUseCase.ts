import { Restaurant } from "../../domain/Restaurant";
import { InternalServerError } from "../../errors/HttpError";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface ICreateRestaurantDto {
  name: string;
  phone: string;
  address: string;
}

export interface ICreateRestaurantResult {
  restaurantId: string;
  name: string;
  phone: string;
  address: string;
}

export interface ICreateRestaurantUseCase
  extends IUseCase<ICreateRestaurantDto, ICreateRestaurantResult> {
  execute(input: ICreateRestaurantDto): Promise<ICreateRestaurantResult>;
}

export class CreateRestaurantUseCase implements ICreateRestaurantUseCase {
  public constructor(private readonly _repository: IRestaurantRepository) {}

  public async execute(
    input: ICreateRestaurantDto
  ): Promise<ICreateRestaurantResult> {
    const newRestaurant = new Restaurant(
      undefined,
      input.name,
      input.phone,
      input.address
    );

    const result = await this._repository.save(newRestaurant);

    if (!result) {
      throw new InternalServerError();
    }

    const body = result.toJSON();

    return body;
  }
}
