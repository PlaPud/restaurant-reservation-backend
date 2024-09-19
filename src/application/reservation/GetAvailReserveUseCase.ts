import { ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IGetAvailReserveDto {
  restaurantId: string;
}

export interface IGetAvailReserveResult {
  data: ReservationObj[];
}

export class GetAvailReserveUseCase
  implements IUseCase<IGetAvailReserveDto, IGetAvailReserveResult>
{
  private _page = 1;

  public constructor(private readonly _repository: IReserveRepository) {}

  public setPagination(page: number) {
    this._page = page ?? this._page;
  }

  public async execute(
    input: IGetAvailReserveDto
  ): Promise<IGetAvailReserveResult> {
    const result = await this._repository.findAvailReserves(
      input.restaurantId,
      this._page
    );

    if (!result) throw new InternalServerError();

    const body: IGetAvailReserveResult = {
      data: result.map((r) => r.toObject()),
    };
    return body;
  }
}
