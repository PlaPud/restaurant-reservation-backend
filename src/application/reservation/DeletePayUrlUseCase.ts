import { InternalServerError } from "../../errors/HttpError";
import { IImageRepository } from "../../infrastructure/interfaces/IImageRepository";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IDeletePayUrlDto {
  reserveId: string;
}

export interface IDeletePayUrlResult {
  reserveId: string;
  customerId: string;
  payImgUrl: string;
}

export class DeletePayUrlUseCase
  implements IUseCase<IDeletePayUrlDto, IDeletePayUrlResult>
{
  public constructor(
    private readonly _repository: IReserveRepository,
    private readonly _imgRepo: IImageRepository
  ) {}

  public async execute(input: IDeletePayUrlDto): Promise<IDeletePayUrlResult> {
    const reservation = await this._repository.find(input.reserveId);

    if (!reservation) throw new InternalServerError();

    const isDeleted = await this._imgRepo.deletePaymentImage(
      reservation.payImgUrl
    );

    if (!isDeleted) throw new InternalServerError();

    const updatedData = await this._repository.updatePaymentUrl(
      reservation.reserveId,
      ""
    );

    if (!updatedData) throw new InternalServerError();

    const body: IDeletePayUrlResult = {
      reserveId: updatedData.reserveId,
      customerId: updatedData.customerId!,
      payImgUrl: updatedData.payImgUrl,
    };

    return body;
  }
}
