import { ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";
import { getTotalPages } from "../../shared/utilsFunc";

export interface IGetAttendReserveDto {
  page: number;
  searchQuery: string;
  restaurantId?: string;
  customerId?: string;
}

export interface IGetAttendReserveResult {
  page: number;
  totalPages: number;
  data: ReservationObj[];
}

export class GetAttendReserveUseCase
  implements IUseCase<IGetAttendReserveDto, IGetAttendReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(
    input: IGetAttendReserveDto
  ): Promise<IGetAttendReserveResult> {
    const result = await this._repository.findAttendAndLateReserves(
      input.page,
      input.searchQuery,
      input.restaurantId,
      input.customerId
    );

    if (!result) throw new InternalServerError();

    const body: IGetAttendReserveResult = {
      page: input.page,
      totalPages: result.count,
      data: result.data.map((r) => r.toObject()),
    };

    return body;
  }
}
