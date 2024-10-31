import { Reservation, ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IGetManyReserveDto {
  restaurantId?: string;
  customerId?: string;
}

export interface IGetManyReserveResult {
  page: number;
  totalPages: number;
  data: ReservationObj[];
}

export class GetManyReserveUseCase
  implements IUseCase<IGetManyReserveDto, IGetManyReserveResult>
{
  private _page = 1;
  private _searchQuery?: string;
  public constructor(private readonly _repository: IReserveRepository) {}

  public setSearching(page: number, searchQuery: string) {
    this._page = page ?? 1;
    this._searchQuery = searchQuery;
  }

  public async execute(
    input: IGetManyReserveDto
  ): Promise<IGetManyReserveResult> {
    const result = await this._repository.findMany(
      this._page,
      this._searchQuery ?? "",
      input.restaurantId,
      input.customerId
    );

    if (!result) throw new InternalServerError();

    const body: IGetManyReserveResult = {
      page: this._page,
      totalPages: result.count,
      data: result.data.map((r) => r.toObject()),
    };

    return body;
  }
}
