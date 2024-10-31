import { Reservation } from "../../domain/Reservation";

export interface ReservationWithCount {
  count: number;
  data: Reservation[];
}

export interface IReserveRepository {
  find(id: string): Promise<Reservation | null>;

  findAvailReserves(
    restaurantId: string,
    page: number
  ): Promise<ReservationWithCount | null>;

  findPendingReserves(
    page: number,
    searchQuery: string,
    restaurantId?: string,
    customerId?: string
  ): Promise<ReservationWithCount | null>;

  findBookedReserves(
    page: number,
    searchQuery: string,
    restaurantId?: string,
    customerId?: string
  ): Promise<ReservationWithCount | null>;

  findAttendAndLateReserves(
    page: number,
    searchQuery: string,
    restaurantId?: string,
    customerId?: string
  ): Promise<ReservationWithCount | null>;

  findMany(
    // restaurantId: string,
    page: number,
    searchQuery: string,
    restaurantId?: string,
    customerId?: string
  ): Promise<ReservationWithCount | null>;

  save(reservation: Reservation): Promise<Reservation | null>;

  update(id: string, data: Reservation): Promise<Reservation | null>;

  updateAttendance(
    id: string,
    isAttended: boolean
  ): Promise<Reservation | null>;

  updatePaymentUrl(id: string, payImgUrl: string): Promise<Reservation | null>;

  updatePay(id: string, isPayed: boolean): Promise<Reservation | null>;

  makeReservation(id: string, customerId: string): Promise<Reservation | null>;

  cancelReservation(id: string): Promise<Reservation | null>;

  delete(id: string): Promise<boolean>;

  deleteAll(): Promise<boolean>;
}
