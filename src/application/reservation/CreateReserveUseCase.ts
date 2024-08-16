import { Reservation } from "../../domain/Reservation";
import { IReserveRepository } from "../../infrastructure/interfaces/IReserveRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface ICreateReserveDto {
  restaurantId: string;
  seats: number;
  reserveDate: string;
}

export interface ICreateReserveResult {}

export class CreateReserveUseCase
  implements IUseCase<ICreateReserveDto, ICreateReserveResult>
{
  public constructor(private readonly _repository: IReserveRepository) {}

  public async execute(
    input: ICreateReserveDto
  ): Promise<ICreateReserveResult> {
    // const newReserve = new Reservation(
    //   undefined,
    //   "",
    //   input.restaurantId,
    //   undefined,
    //   input.seats,
    //   input.reserveDate
    // );

    // const result = await this._repository.save();

    const body: ICreateReserveResult = {};

    return body;
  }
}
