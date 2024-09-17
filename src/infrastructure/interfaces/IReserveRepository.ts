import { Reservation } from "../../domain/Reservation";

export interface IReserveRepository {
  find(id: string): Promise<Reservation | null>;

  findAvailReserves(
    restaurantId: string,
    page: number
  ): Promise<Reservation[] | null>;

  findBookedReserves(
    restaurantId: string,
    page: number
  ): Promise<Reservation[] | null>;

  findAttendReserves(
    restaurantId: string,
    page: number
  ): Promise<Reservation[] | null>;

  findMany(page: number): Promise<Reservation[] | null>;

  save(reservation: Reservation): Promise<Reservation | null>;

  update(id: string, data: Reservation): Promise<Reservation | null>;

  updateAttendance(
    id: string,
    isAttended: boolean
  ): Promise<Reservation | null>;

  updatePaymentUrl(id: string, payImgUrl: string): Promise<Reservation | null>;

  updatePay(id: string, isPayed: boolean): Promise<Reservation | null>;

  delete(id: string): Promise<boolean>;

  deleteAll(): Promise<boolean>;
}
