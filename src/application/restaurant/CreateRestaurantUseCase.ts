import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Restaurant } from "../../domain/Restaurant";
import { InternalServerError } from "../../errors/HttpError";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { IUseCase } from "../../shared/IUseCase";
import { RESTAURANT_T } from "../../shared/inversify/restaurant.types";

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

@injectable()
export class CreateRestaurantUseCase implements ICreateRestaurantUseCase {
  public constructor(
    @inject(RESTAURANT_T.InMemoryRestaurantRepository)
    private readonly _repository: IRestaurantRepository
  ) {}

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
