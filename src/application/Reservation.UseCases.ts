import { IReserveRepository } from "../infrastructure/interfaces/IReserveRepository";
import { CreateReserveUseCase } from "./reservation/CreateReserveUseCase";
import { DeleteAllReserveUseCase } from "./reservation/DeleteAllReserveUseCase";
import { DeleteReserveUseCase } from "./reservation/DeleteReserveUseCase";
import { GetAllReserveUseCase } from "./reservation/GetAllReserveUseCase";
import { GetAttendReserveUseCase } from "./reservation/GetAttendReserveUseCase";
import { GetAvailReserveUseCase } from "./reservation/GetAvailReserveUseCase";
import { GetBookedReserveUseCase } from "./reservation/GetBookedReserveUseCase";
import { GetReserveUseCase } from "./reservation/GetReserveUseCase";
import { UpdateAttendUseCase } from "./reservation/UpdateAttendUseCase";
import { UpdatePayedUseCase } from "./reservation/UpdatePayedUseCase";
import { UpdatePayUrlUseCase } from "./reservation/UpdatePayUrlUseCase";
import { UpdateReserveUseCase } from "./reservation/UpdateReserveUseCase";

export class ReservationUseCases {
  public readonly create: CreateReserveUseCase;
  public readonly get: GetReserveUseCase;
  public readonly getAvail: GetAvailReserveUseCase;
  public readonly getBooked: GetBookedReserveUseCase;
  public readonly getAttend: GetAttendReserveUseCase;
  public readonly getAll: GetAllReserveUseCase;
  public readonly update: UpdateReserveUseCase;
  public readonly updateAttend: UpdateAttendUseCase;
  public readonly updatePayed: UpdatePayedUseCase;
  public readonly updatePayUrl: UpdatePayUrlUseCase;
  public readonly delete: DeleteReserveUseCase;
  public readonly deleteAll: DeleteAllReserveUseCase;

  public constructor(private readonly _repository: IReserveRepository) {
    this.create = new CreateReserveUseCase(this._repository);
    this.get = new GetReserveUseCase(this._repository);
    this.getAvail = new GetAvailReserveUseCase(this._repository);
    this.getBooked = new GetBookedReserveUseCase(this._repository);
    this.getAttend = new GetAttendReserveUseCase(this._repository);
    this.getAll = new GetAllReserveUseCase(this._repository);
    this.update = new UpdateReserveUseCase(this._repository);
    this.updateAttend = new UpdateAttendUseCase(this._repository);
    this.updatePayUrl = new UpdatePayUrlUseCase(this._repository);
    this.updatePayed = new UpdatePayedUseCase(this._repository);
    this.delete = new DeleteReserveUseCase(this._repository);
    this.deleteAll = new DeleteAllReserveUseCase(this._repository);
  }
}