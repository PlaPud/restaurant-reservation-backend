import { ReservationJSON } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IUpdatePayUrlDto {
  reserveId: string;
  payImgUrl: string;
}

export interface IUpdatePayUrlResult extends ReservationJSON {}

export class UpdatePayUrlUseCase
  implements IUseCase<IUpdatePayUrlDto, IUpdatePayUrlResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(input: IUpdatePayUrlDto): Promise<IUpdatePayUrlResult> {
    const target = await this._repository.find(input.reserveId);

    if (!target) throw new InternalServerError();

    if (target.payImgUrl) return target.toJSON();

    const result = await this._repository.updatePaymentUrl(
      target.reserveId,
      input.payImgUrl
    );

    if (!result) throw new InternalServerError();

    const body: IUpdatePayUrlResult = result?.toJSON();

    return body;
  }
}
