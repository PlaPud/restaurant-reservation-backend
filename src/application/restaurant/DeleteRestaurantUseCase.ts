import { InternalServerError } from "../../errors/HttpError";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";

export interface IDeleteRestaurantDto {
  restaurantId: string;
}

export interface IDeleteRestaurantResult {
  deletionComplete: boolean;
  deletedId: string;
}

export interface IDeleteRestaurantUseCase {
  execute(input: IDeleteRestaurantDto): Promise<IDeleteRestaurantResult>;
}

export class DeleteRestaurantUseCase implements IDeleteRestaurantUseCase {
  public constructor(private readonly _repository: IRestaurantRepository) {}

  public async execute(
    input: IDeleteRestaurantDto
  ): Promise<IDeleteRestaurantResult> {
    const result = await this._repository.delete(input.restaurantId);

    if (!result) throw new InternalServerError();

    const body: IDeleteRestaurantResult = {
      deletionComplete: result,
      deletedId: input.restaurantId,
    };

    return body;
  }
}
