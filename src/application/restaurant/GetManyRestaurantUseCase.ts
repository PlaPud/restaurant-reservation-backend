import { inject, injectable } from "inversify";
import { RestaurantObj } from "../../domain/Restaurant";
import { InternalServerError } from "../../errors/HttpError";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { RESTAURANT_T } from "../../shared/inversify/restaurant.types";
import { IUseCase } from "../../shared/IUseCase";
import { IFilterRestaurant } from "../../shared/searchFilter";
import { PAGE_SIZE } from "../../shared/constants";
import { getTotalPages } from "../../shared/utilsFunc";

export interface IGetManyRestaurantResult {
  page: number;
  totalPages: number;
  data: RestaurantObj[];
}

export interface IGetManyRestaurantUseCase
  extends IUseCase<null, IGetManyRestaurantResult> {
  execute(input: null): Promise<IGetManyRestaurantResult>;
  setSearching(
    page: number,
    searchQuery?: string,
    filterBy?: IFilterRestaurant
  ): void;
}

@injectable()
export class GetManyRestaurantUseCase implements IGetManyRestaurantUseCase {
  private _page = 1;
  private _searchQuery?: string;
  private _filterProps?: IFilterRestaurant;

  public constructor(
    @inject(RESTAURANT_T.InMemoryRestaurantRepository)
    private readonly _repository: IRestaurantRepository
  ) {}

  public setSearching(
    page?: number,
    searchQuery?: string,
    filterBy?: IFilterRestaurant
  ) {
    this._searchQuery = searchQuery;
    this._page = page ?? 1;
    this._filterProps = filterBy;
  }

  public async execute(input: null): Promise<IGetManyRestaurantResult> {
    const results = await this._repository.findMany(
      this._page,
      this._searchQuery,
      this._filterProps ?? {}
    );

    if (!results) throw new InternalServerError();

    const recordsCount = await this._repository.getRecordsCount(
      this._page,
      this._searchQuery,
      this._filterProps
    );

    const body: IGetManyRestaurantResult = {
      page: this._page,
      totalPages: getTotalPages(recordsCount),
      data: results.map((rs) => rs.toObject()),
    };

    return body;
  }
}
