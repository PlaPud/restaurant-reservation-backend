import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Restaurant } from "../../domain/Restaurant";
import { InternalServerError } from "../../errors/HttpError";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { IUseCase } from "../../shared/IUseCase";
import { RESTAURANT_T } from "../../shared/inversify/restaurant.types";
import { hash } from "bcrypt";

export interface ICreateRestaurantDto {
  name: string;
  phone: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  email: string;
  password: string | Buffer;
}

export interface ICreateRestaurantResult {
  restaurantId: string;
  name: string;
  phone: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  email: string;
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
    const hashPassword = await hash(input.password, 10);

    input.password = "";

    const newRestaurant = new Restaurant({
      name: input.name,
      phone: input.phone,
      address: input.address,
      subDistrict: input.subDistrict,
      district: input.district,
      province: input.province,
      email: input.email,
      hashPassword,
    });

    const result = await this._repository.save(newRestaurant);

    if (!result) {
      throw new InternalServerError();
    }

    const body = result.toObject();

    return body;
  }
}
