import { ReservationJSON } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { BusinessRuleViolationError } from "../../errors/UseCaseError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IUpdateAttendDto {
  reserveId: string;
  isAttended: boolean;
}

export interface IUpdateAttendResult extends ReservationJSON {}

export class UpdateAttendUseCase
  implements IUseCase<IUpdateAttendDto, IUpdateAttendResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(input: IUpdateAttendDto): Promise<IUpdateAttendResult> {
    const target = await this._repository.find(input.reserveId);

    if (!target) throw new InternalServerError();

    if (target.isAttended) return target.toJSON();

    if (!target.isPayed) throw new BusinessRuleViolationError();

    const result = await this._repository.updateAttendance(
      target.reserveId,
      input.isAttended
    );

    if (!result) throw new InternalServerError();

    const body = result.toJSON();

    return body;
  }
}
