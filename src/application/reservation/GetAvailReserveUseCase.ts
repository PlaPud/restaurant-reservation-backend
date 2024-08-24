import { ReservationJSON } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IGetAvailReserveDto {
  restaurantId: string;
}

export interface IGetAvailReserveResult {
  data: ReservationJSON[];
}

export class GetAvailReserveUseCase
  implements IUseCase<IGetAvailReserveDto, IGetAvailReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(
    input: IGetAvailReserveDto
  ): Promise<IGetAvailReserveResult> {
    const result = await this._repository.findAvailReserves(input.restaurantId);

    if (!result) throw new InternalServerError();

    const body: IGetAvailReserveResult = {
      data: result.map((r) => r.toJSON()),
    };
    return body;
  }
}
