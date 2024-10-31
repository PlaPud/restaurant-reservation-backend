import { ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IGetAvailReserveDto {
  restaurantId: string;
  page: number;
}

export interface IGetAvailReserveResult {
  page: number;
  totalPages: number;
  data: ReservationObj[];
}

export class GetAvailReserveUseCase
  implements IUseCase<IGetAvailReserveDto, IGetAvailReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(
    input: IGetAvailReserveDto
  ): Promise<IGetAvailReserveResult> {
    const result = await this._repository.findAvailReserves(
      input.restaurantId,
      input.page
    );

    if (!result) throw new InternalServerError();

    const body: IGetAvailReserveResult = {
      page: input.page,
      totalPages: result.count,
      data: result.data.map((r) => r.toObject()),
    };
    return body;
  }
}
