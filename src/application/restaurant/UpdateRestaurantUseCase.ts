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
    subDistrict: string;
    district: string;
    province: string;
    email: string;
    description: string;
    paymentInfo: string;
  };
}

export interface IUpdateRestaurantResult {
  restaurantId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  description: string;
  paymentInfo: string;
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
    // const hashPassword = await hash(input.data.password, 10);

    // input.data.password = "";

    const restaurant = new Restaurant({
      restaurantId: input.restaurantId,
      name: input.data.name,
      phone: input.data.phone,
      address: input.data.address,
      subDistrict: input.data.subDistrict,
      district: input.data.district,
      province: input.data.province,
      email: input.data.email,
      description: input.data.description,
      paymentInfo: input.data.paymentInfo,
      hashPassword: "",
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
      subDistrict: result.subDistrict,
      district: result.district,
      province: result.province,
      description: result.description,
      paymentInfo: result.paymentInfo,
      email: result.email,
    };

    return body;
  }
}
