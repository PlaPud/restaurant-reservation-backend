import { Reservation } from "../../domain/Reservation";

export interface IReserveRepository {
  find(id: string): Promise<Reservation | null>;

  findAvailReserves(restaurantId: string): Promise<Reservation[] | null>;

  findBookedReserves(reservationId: string): Promise<Reservation[] | null>;

  findAll(): Promise<Reservation[] | null>;

  save(reservation: Reservation): Promise<Reservation | null>;

  update(id: string, data: Reservation): Promise<Reservation | null>;

  updateAttendance(
    id: string,
    isAttended: boolean
  ): Promise<Reservation | null>;

  updatePaymentUrl(id: string, payImgUrl: string): Promise<Reservation | null>;

  updatePay(id: string, isPayed: boolean): Promise<Reservation | null>;

  changeReserveDate(id: string, date: string): Promise<Reservation | null>;

  delete(id: string): Promise<boolean>;

  deleteAll(): Promise<boolean>;
}
