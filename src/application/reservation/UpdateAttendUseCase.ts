import { ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { BusinessRuleViolationError } from "../../errors/UseCaseError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IUpdateAttendDto {
  reserveId: string;
  isAttended: boolean;
}

export interface IUpdateAttendResult extends ReservationObj {}

export class UpdateAttendUseCase
  implements IUseCase<IUpdateAttendDto, IUpdateAttendResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(input: IUpdateAttendDto): Promise<IUpdateAttendResult> {
    const result = await this._repository.updateAttendance(
      input.reserveId,
      input.isAttended
    );

    if (!result) throw new InternalServerError();

    const body = result.toObject();

    return body;
  }
}
