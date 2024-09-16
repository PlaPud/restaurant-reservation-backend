import "reflect-metadata";
import { Restaurant } from "../../domain/Restaurant";
import { InternalServerError } from "../../errors/HttpError";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { IUseCase } from "../../shared/IUseCase";
import { inject, injectable } from "inversify";
import { RESTAURANT_T } from "../../shared/inversify/restaurant.types";
import { hash } from "bcrypt";

export interface IUpdateRestaurantDto {
  restaurantId: string;
  data: {
    name: string;
    phone: string;
    address: string;
    email: string;
    description: string;
    password: string;
  };
}

export interface IUpdateRestaurantResult {
  restaurantId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  description: string;
}

export interface IUpdateRestaurantUseCase
  extends IUseCase<IUpdateRestaurantDto, IUpdateRestaurantResult> {
  execute(input: IUpdateRestaurantDto): Promise<IUpdateRestaurantResult>;
}

@injectable()
export class UpdateRestaurantUseCase implements IUpdateRestaurantUseCase {
  public constructor(
    @inject(RESTAURANT_T.InMemoryRestaurantRepository)
    private readonly _repository: IRestaurantRepository
  ) {}

  public async execute(
    input: IUpdateRestaurantDto
  ): Promise<IUpdateRestaurantResult> {
    const hashPassword = await hash(input.data.password, 10);

    input.data.password = "";

    const restaurant = new Restaurant({
      restaurantId: input.restaurantId,
      name: input.data.name,
      phone: input.data.phone,
      address: input.data.address,
      email: input.data.email,
      hashPassword,
    });

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
      description: result.description,
      email: result.email,
    };

    return body;
  }
}
