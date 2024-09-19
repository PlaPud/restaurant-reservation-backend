import { Restaurant } from "@prisma/client";
import { IUseCase } from "../../shared/IUseCase";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { RestaurantObj } from "../../domain/Restaurant";
import { InternalServerError, NotFoundError } from "../../errors/HttpError";
import { inject, injectable } from "inversify";
import { InMemoryRestaurantRepository } from "../../infrastructure/InMemoryRestaurantRepository";
import { RESTAURANT_T } from "../../shared/inversify/restaurant.types";
import { IFilterRestaurant } from "../../shared/searchFilter";

export interface IGetManyRestaurantResult {
  page: number;
  data: RestaurantObj[];
}

export interface IGetManyRestaurantUseCase
  extends IUseCase<null, IGetManyRestaurantResult> {
  execute(input: null): Promise<IGetManyRestaurantResult>;
  setPagination(page: number, filterBy?: IFilterRestaurant): void;
}

@injectable()
export class GetAllRestaurantUseCase implements IGetManyRestaurantUseCase {
  private _page = 1;
  private _filterProps: IFilterRestaurant | null = null;

  public constructor(
    @inject(RESTAURANT_T.InMemoryRestaurantRepository)
    private readonly _repository: IRestaurantRepository
  ) {}

  public setPagination(page?: number, filterBy?: IFilterRestaurant) {
    this._page = page ? page : this._page;
    this._filterProps = filterBy ? filterBy : this._filterProps;
  }

  public async execute(input: null): Promise<IGetManyRestaurantResult> {
    const results = await this._repository.findMany(
      this._page,
      this._filterProps
    );

    if (!results) throw new InternalServerError();

    const body = {
      page: this._page,
      data: results.map((rs) => rs.toObject()),
    };

    return body;
  }
}
