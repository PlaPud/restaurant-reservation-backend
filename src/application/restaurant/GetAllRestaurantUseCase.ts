import { Restaurant } from "@prisma/client";
import { IUseCase } from "../../shared/IUseCase";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { RestaurantJSON } from "../../domain/Restaurant";
import { InternalServerError, NotFoundError } from "../../errors/HttpError";

export interface IGetAllRestaurantResult {
  data: RestaurantJSON[];
}

export interface IGetAllRestaurantUseCase
  extends IUseCase<null, IGetAllRestaurantResult> {
  execute(input: null): Promise<IGetAllRestaurantResult>;
}

export class GetAllRestaurantUseCase implements IGetAllRestaurantUseCase {
  public constructor(private readonly _repository: IRestaurantRepository) {}

  public async execute(input: null): Promise<IGetAllRestaurantResult> {
    const results = await this._repository.findAll();

    if (!results) throw InternalServerError;

    const body = {
      data: results.map((rs) => rs.toJSON()),
    };

    return body;
  }
}
