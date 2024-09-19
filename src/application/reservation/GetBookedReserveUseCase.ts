import { ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IGetBookedReserveDto {
  restaurantId: string;
}

export interface IGetBookedReserveResult {
  data: ReservationObj[];
}

export class GetBookedReserveUseCase
  implements IUseCase<IGetBookedReserveDto, IGetBookedReserveResult>
{
  private _page = 1;

  public constructor(private readonly _repository: IReserveRepository) {}

  public setPagination(page: number) {
    this._page = page ?? this._page;
  }

  public async execute(
    input: IGetBookedReserveDto
  ): Promise<IGetBookedReserveResult> {
    const result = await this._repository.findBookedReserves(
      input.restaurantId,
      this._page
    );

    if (!result) throw new InternalServerError();

    const body: IGetBookedReserveResult = {
      data: result.map((r) => r.toObject()),
    };

    return body;
  }
}
