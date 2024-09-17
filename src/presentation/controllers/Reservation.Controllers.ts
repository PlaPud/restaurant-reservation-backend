import { ReservationUseCases } from "../../application/Reservation.UseCases";
import { CreateReserveUseCase } from "../../application/reservation/CreateReserveUseCase";
import { CreateReserveController } from "./reservation/CreateReserveController";
import { DeleteAllReserveController } from "./reservation/DeleteAllReserveController";
import { DeletePayUrlController } from "./reservation/DeletePayUrlController";
import { DeleteReserveController } from "./reservation/DeleteReserveController";
import { GetManyReserveController } from "./reservation/GetManyReserveController";
import { GetAttendReserveController } from "./reservation/GetAttendReserveController";
import { GetAvailReserveController } from "./reservation/GetAvailReserveController";
import { GetBookedReserveController } from "./reservation/GetBookedReserveController";
import { GetReserveController } from "./reservation/GetReserveController";
import { UpdateAttendController } from "./reservation/UpdateAttendController";
import { UpdatePayedController } from "./reservation/UpdatePayedController";
import { UpdatePayUrlController } from "./reservation/UpdatePayUrlController";
import { UpdateReserveController } from "./reservation/UpdateReserveController";

export class ReservationControllers {
  public readonly create: CreateReserveController;
  public readonly get: GetReserveController;
  public readonly getAvail: GetAvailReserveController;
  public readonly getBooked: GetBookedReserveController;
  public readonly getAttend: GetAttendReserveController;
  public readonly getAll: GetManyReserveController;
  public readonly update: UpdateReserveController;
  public readonly updatePayUrl: UpdatePayUrlController;
  public readonly updatePayed: UpdatePayedController;
  public readonly updateAttend: UpdateAttendController;
  public readonly delete: DeleteReserveController;
  public readonly deleteAll: DeleteAllReserveController;
  public readonly deletePayUrl: DeletePayUrlController;

  public constructor(private readonly _useCases: ReservationUseCases) {
    this.create = new CreateReserveController(this._useCases.create);
    this.get = new GetReserveController(this._useCases.get);
    this.getAvail = new GetAvailReserveController(this._useCases.getAvail);
    this.getBooked = new GetBookedReserveController(this._useCases.getBooked);
    this.getAttend = new GetAttendReserveController(this._useCases.getAttend);
    this.getAll = new GetManyReserveController(this._useCases.getAll);
    this.update = new UpdateReserveController(this._useCases.update);
    this.updatePayUrl = new UpdatePayUrlController(this._useCases.updatePayUrl);
    this.updatePayed = new UpdatePayedController(this._useCases.updatePayed);
    this.updateAttend = new UpdateAttendController(this._useCases.updateAttend);
    this.delete = new DeleteReserveController(this._useCases.delete);
    this.deleteAll = new DeleteAllReserveController(this._useCases.deleteAll);
    this.deletePayUrl = new DeletePayUrlController(this._useCases.deletePayUrl);
  }
}
