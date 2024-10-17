import { faker } from "@faker-js/faker";
import { Reservation } from "../domain/Reservation";
import { Restaurant } from "../domain/Restaurant";
import { EntityNotFoundError } from "../errors/DomainError";
import { BadRequestError, NotFoundError } from "../errors/HttpError";
import { DataIntegrityError, RepositoryError } from "../errors/RepositoryError";
import {
  IReserveRepository,
  ReservationWithCount,
} from "./interfaces/IReserveRepository";

export class InMemoryReserveRepository implements IReserveRepository {
  private readonly _reserves: Reservation[] = [];
  private readonly _restaurants: Restaurant[] = [
    new Restaurant({
      restaurantId: "1",
      name: "restaurant1",
      phone: "123",
      address: "Mock Street",
      email: "rest1@email.com",
      subDistrict: "",
      district: "",
      province: "",
      hashPassword: faker.string.alphanumeric({ length: 32, casing: "mixed" }),
      reservation: [...this._reserves.filter((r) => r.restaurantId === "1")],
    }),
    new Restaurant({
      restaurantId: "2",
      name: "restaurant2",
      phone: "123",
      address: "Mock Street",
      subDistrict: "",
      district: "",
      province: "",
      email: "rest2@email.com",
      hashPassword: faker.string.alphanumeric({ length: 32, casing: "mixed" }),
      reservation: [...this._reserves.filter((r) => r.restaurantId === "2")],
    }),
  ];

  public constructor() {}
  cancelReservation(id: string): Promise<Reservation | null> {
    throw new Error("Method not implemented.");
  }
  public async findPendingReserves(
    restaurantId: string,
    page: number,
    searchQuery: string
  ): Promise<ReservationWithCount | null> {
    throw new Error("Method not implemented.");
  }

  public async find(id: string): Promise<Reservation | null> {
    const result: Reservation | undefined = this._findById(id);

    if (!result)
      throw new EntityNotFoundError(`Cannot Find Reservation (ID: ${id})`);

    return result;
  }

  public async findAvailReserves(
    restaurantId: string,
    page: number
  ): Promise<ReservationWithCount | null> {
    const restaurant = this._restaurants.find(
      (rs) => rs.restaurantId === restaurantId
    );

    if (!restaurant) throw new EntityNotFoundError();

    const result: Reservation[] = restaurant.reservation!.filter(
      (r) => !r.isPayed
    );

    if (!result) throw new DataIntegrityError();

    return {
      count: 3,
      data: result,
    };
  }

  public async findBookedReserves(
    restaurantId: string,
    page: number,
    searchQuery: string
  ): Promise<ReservationWithCount | null> {
    const restaurant = this._restaurants.find(
      (rs) => rs.restaurantId === restaurantId
    );

    if (!restaurant) throw new EntityNotFoundError();

    const result: Reservation[] = restaurant.reservation!.filter(
      (r) => r.isPayed
    );

    if (!result) throw new DataIntegrityError();

    return {
      count: 3,
      data: result,
    };
  }

  public async findAttendAndLateReserves(
    restaurantId: string,
    page: number,
    searchQuery: string
  ): Promise<ReservationWithCount | null> {
    const restaurant = this._restaurants.find(
      (rs) => rs.restaurantId === restaurantId
    );

    if (!restaurant) throw new EntityNotFoundError();

    const result: Reservation[] = restaurant.reservation!.filter(
      (r) => r.isAttended
    );

    if (!result) throw new DataIntegrityError();

    return {
      count: 3,
      data: result,
    };
  }

  public async findMany(
    restaurantId: string,
    page: number,
    searchQuery: string
  ): Promise<ReservationWithCount | null> {
    const result =
      this._reserves.filter((rs) => rs.restaurantId === restaurantId) ?? null;

    if (!result) throw new DataIntegrityError();

    return {
      count: 3,
      data: result,
    };
  }

  public async save(reservation: Reservation): Promise<Reservation | null> {
    const restaurant = this._restaurants.find(
      (rs) => rs.restaurantId === reservation.restaurantId
    );

    if (!restaurant)
      throw new BadRequestError(
        `Cannot Create Reservation : Restaurant ID=${reservation.restaurantId} Not Found`
      );

    try {
      reservation.restaurant = restaurant;
      this._reserves.push(reservation);
      return reservation;
    } catch (e) {
      throw new RepositoryError("Repository Error");
    }
  }

  public async updateAttendance(
    id: string,
    isAttended: boolean
  ): Promise<Reservation | null> {
    const reservation: Reservation | undefined = this._findById(id);

    if (!reservation) throw new NotFoundError();

    reservation.isAttended = isAttended;

    return reservation;
  }

  public async updatePaymentUrl(
    id: string,
    payImgUrl: string
  ): Promise<Reservation | null> {
    const reservation: Reservation | undefined = this._findById(id);

    if (!reservation) throw new NotFoundError();

    reservation.payImgUrl = payImgUrl;
    return reservation;
  }

  public async updatePay(id: string, isPayed: boolean): Promise<Reservation> {
    const reservation: Reservation | undefined = this._findById(id);

    if (!reservation) throw new NotFoundError();

    reservation.isPayed = isPayed;
    return reservation;
  }

  // public async changeReserveDate(
  //   id: string,
  //   date: number
  // ): Promise<Reservation | null> {
  //   const reservation: Reservation | undefined = this._findById(id);

  //   if (!reservation) throw new NotFoundError();

  //   reservation.reserveDate = date;
  //   return reservation;
  // }

  public async update(
    id: string,
    data: Reservation
  ): Promise<Reservation | null> {
    const idx = this._reserves.findIndex((r) => r.reserveId === id);

    if (!indexFound(idx)) throw new NotFoundError();

    this._reserves[idx] = data;

    // if reservation has customerId don't forget to populate the data

    return data;
  }

  public async delete(id: string): Promise<boolean> {
    const idx = this._reserves.findIndex((r) => r.reserveId === id);

    if (!indexFound(idx)) return false;

    this._reserves.splice(idx, 1);
    return true;
  }

  public async deleteAll(): Promise<boolean> {
    this._reserves.splice(0, this._reserves.length);
    return true;
  }

  private _findById(id: string): Reservation | undefined {
    return this._reserves.find((r) => r.reserveId === id);
  }
}

const indexFound = (idx: number) => idx >= 0;
