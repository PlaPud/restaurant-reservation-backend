import { Reservation, ReservationObj } from "../../domain/Reservation";
import { InternalServerError } from "../../errors/HttpError";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IGetManyReserveResult {
  page: number;
  data: ReservationObj[];
}

export class GetManyReserveUseCase
  implements IUseCase<null, IGetManyReserveResult>
{
  private _page = 1;

  public constructor(private readonly _repository: IReserveRepository) {}

  public setPagination(page: number) {
    this._page = page ? page : this._page;
  }

  public async execute(input: null): Promise<IGetManyReserveResult> {
    const result = await this._repository.findMany(this._page);

    if (!result) throw new InternalServerError();

    const body: IGetManyReserveResult = {
      page: this._page,
      data: result.map((r) => r.toObject()),
    };

    return body;
  }
}
