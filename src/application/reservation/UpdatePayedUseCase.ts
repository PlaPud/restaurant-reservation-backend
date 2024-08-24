import { Reservation, ReservationJSON } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { BusinessRuleViolationError } from "../../errors/UseCaseError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IUpdatePayedDto {
  reserveId: string;
  isPayed: boolean;
}

export interface IUpdatePayedResult extends ReservationJSON {}

export class UpdatePayedUseCase
  implements IUseCase<IUpdatePayedDto, IUpdatePayedResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(input: IUpdatePayedDto): Promise<IUpdatePayedResult> {
    const result = await this._repository.updatePay(
      input.reserveId,
      input.isPayed
    );

    if (!result) throw new InternalServerError();

    const body: IUpdatePayedResult = result.toJSON();

    return body;
  }
}
