import { ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";
import { getTotalPages } from "../../shared/utilsFunc";

export interface IGetPendingReserveDto {
  restaurantId?: string;
  customerId?: string;
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
      input.page,
      input.searchQuery,
      input.restaurantId,
      input.customerId
    );

    if (!result) throw new InternalServerError();

    const body: IGetPendingReserveResult = {
      page: input.page,
      totalPages: getTotalPages(result.count),
      data: result.data.map((r) => r.toObject()),
    };
    return body;
  }
}
