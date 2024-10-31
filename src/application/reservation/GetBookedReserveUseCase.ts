import { ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IGetBookedReserveDto {
  page: number;
  searchQuery: string;
  restaurantId?: string;
  customerId?: string;
}

export interface IGetBookedReserveResult {
  page: number;
  totalPages: number;
  data: ReservationObj[];
}

export class GetBookedReserveUseCase
  implements IUseCase<IGetBookedReserveDto, IGetBookedReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(
    input: IGetBookedReserveDto
  ): Promise<IGetBookedReserveResult> {
    const result = await this._repository.findBookedReserves(
      input.page,
      input.searchQuery,
      input.restaurantId,
      input.customerId
    );

    if (!result) throw new InternalServerError();

    const body: IGetBookedReserveResult = {
      page: input.page,
      totalPages: result.count,
      data: result.data.map((r) => r.toObject()),
    };

    return body;
  }
}
