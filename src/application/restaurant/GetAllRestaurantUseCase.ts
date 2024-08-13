import { Restaurant } from "@prisma/client";
import { IUseCase } from "../../shared/IUseCase";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { RestaurantJSON } from "../../domain/Restaurant";
import { InternalServerError, NotFoundError } from "../../errors/HttpError";
import { inject, injectable } from "inversify";
import { InMemoryRestaurantRepository } from "../../infrastructure/InMemoryRestaurantRepository";
import { RESTAURANT_T } from "../../shared/inversify/restaurant.types";

export interface IGetAllRestaurantResult {
  data: RestaurantJSON[];
}

export interface IGetAllRestaurantUseCase
  extends IUseCase<null, IGetAllRestaurantResult> {
  execute(input: null): Promise<IGetAllRestaurantResult>;
}

@injectable()
export class GetAllRestaurantUseCase implements IGetAllRestaurantUseCase {
  public constructor(
    @inject(RESTAURANT_T.InMemoryRestaurantRepository)
    private readonly _repository: IRestaurantRepository
  ) {}

  public async execute(input: null): Promise<IGetAllRestaurantResult> {
    const results = await this._repository.findAll();

    if (!results) throw new InternalServerError();

    const body = {
      data: results.map((rs) => rs.toJSON()),
    };

    return body;
  }
}
