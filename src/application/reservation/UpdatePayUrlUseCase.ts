import { ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IUpdatePayUrlDto {
  reserveId: string;
  payImgUrl: string;
}

export interface IUpdatePayUrlResult extends ReservationObj {}

export class UpdatePayUrlUseCase
  implements IUseCase<IUpdatePayUrlDto, IUpdatePayUrlResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(input: IUpdatePayUrlDto): Promise<IUpdatePayUrlResult> {
    const result = await this._repository.updatePaymentUrl(
      input.reserveId,
      input.payImgUrl
    );

    if (!result) throw new InternalServerError();

    const body: IUpdatePayUrlResult = result?.toObject();

    return body;
  }
}
