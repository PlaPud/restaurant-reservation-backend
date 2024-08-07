import { Restaurant } from "@prisma/client";
import { IUseCase } from "../../shared/IUseCase";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { InternalServerError } from "../../errors/HttpError";

export interface IDeleteAllRestaurantResult {
  deletionComplete: boolean;
}

export interface IDeleteAllRestaurantUseCase
  extends IUseCase<null, IDeleteAllRestaurantResult> {
  execute(input: null): Promise<IDeleteAllRestaurantResult>;
}

export class DeleteAllRestaurantUseCase implements IDeleteAllRestaurantUseCase {
  public constructor(private readonly _repository: IRestaurantRepository) {}

  public async execute(input: null): Promise<IDeleteAllRestaurantResult> {
    const result = this._repository.deleteAll();

    if (!result) throw new InternalServerError();

    const body: IDeleteAllRestaurantResult = {
      deletionComplete: true,
    };
    return body;
  }
}
