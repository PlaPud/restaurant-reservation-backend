import { ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IGetPendingReserveDto {
  restaurantId: string;
  page: number;
  searchQuery: string;
}

export interface IGetPendingReserveResult {
  page: number;
  totalPages: number;
  data: ReservationObj[];
}

export class GetPendingReserveUseCase
  implements IUseCase<IGetPendingReserveDto, IGetPendingReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(
    input: IGetPendingReserveDto
  ): Promise<IGetPendingReserveResult> {
    const result = await this._repository.findPendingReserves(
      input.restaurantId,
      input.page,
      input.searchQuery
    );

    if (!result) throw new InternalServerError();

    const body: IGetPendingReserveResult = {
      page: input.page,
      totalPages: result.count,
      data: result.data.map((r) => r.toObject()),
    };
    return body;
  }
}
