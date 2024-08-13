import { inject, injectable } from "inversify";
import "reflect-metadata";
import { InternalServerError } from "../../errors/HttpError";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { RESTAURANT_T } from "../../shared/inversify/restaurant.types";
import { IUseCase } from "../../shared/IUseCase";
export interface IDeleteAllRestaurantResult {
  deletionComplete: boolean;
}

export interface IDeleteAllRestaurantUseCase
  extends IUseCase<null, IDeleteAllRestaurantResult> {
  execute(input: null): Promise<IDeleteAllRestaurantResult>;
}

@injectable()
export class DeleteAllRestaurantUseCase implements IDeleteAllRestaurantUseCase {
  public constructor(
    @inject(RESTAURANT_T.InMemoryRestaurantRepository)
    private readonly _repository: IRestaurantRepository
  ) {}

  public async execute(input: null): Promise<IDeleteAllRestaurantResult> {
    const result = await this._repository.deleteAll();

    if (!result) throw new InternalServerError();

    const body: IDeleteAllRestaurantResult = {
      deletionComplete: true,
    };
    return body;
  }
}
