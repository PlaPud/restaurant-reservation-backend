import { ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { FirebaseImgRepository } from "../../infrastructure/firebase/FirebaseImgRepository";
import { IImageRepository } from "../../infrastructure/interfaces/IImageRepository";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IUpdatePayUrlDto {
  reserveId: string;
  payImg: Buffer;
}

export interface IUpdatePayUrlResult extends ReservationObj {}

export class UpdatePayUrlUseCase
  implements IUseCase<IUpdatePayUrlDto, IUpdatePayUrlResult>
{
  public constructor(
    private readonly _repository: IReserveRepository,
    private readonly _fireBase: IImageRepository
  ) {}

  public async execute(input: IUpdatePayUrlDto): Promise<IUpdatePayUrlResult> {
    const firebaseImgPath = await this._fireBase.uploadPaymentImage(
      input.payImg
    );

    const result = await this._repository.updatePaymentUrl(
      input.reserveId,
      firebaseImgPath ?? ""
    );

    if (!result) throw new InternalServerError();

    const body: IUpdatePayUrlResult = result?.toObject();

    return body;
  }
}
