import { faker } from "@faker-js/faker";
import { Reservation } from "../domain/Reservation";
import { Restaurant } from "../domain/Restaurant";
import { EntityNotFoundError } from "../errors/DomainError";
import { NotFoundError } from "../errors/HttpError";
import { DataIntegrityError, RepositoryError } from "../errors/RepositoryError";
import { IReserveRepository } from "./interfaces/IReserveRepository";

export class InMemoryReserveRepository implements IReserveRepository {
  private readonly _reserves: Reservation[] = [
    new Reservation({
      restaurantId: "1",
      seats: 3,
      reserveDate: Date.now().toString(),
    }),
    new Reservation({
      restaurantId: "1",
      seats: 6,
      reserveDate: Date.now().toString(),
      isPayed: true,
    }),
    new Reservation({
      restaurantId: "1",
      seats: 4,
      reserveDate: Date.now().toString(),
      isPayed: true,
      isAttended: true,
    }),
    new Reservation({
      restaurantId: "1",
      seats: 7,
      reserveDate: Date.now().toString(),
      isPayed: true,
    }),
  ];
  private readonly _restaurants: Restaurant[] = [
    new Restaurant({
      restaurantId: "1",
      name: "restaurant1",
      phone: "123",
      address: "Mock Street",
      currentReserves: [
        ...this._reserves.filter((r) => r.restaurantId === "1"),
      ],
    }),
    new Restaurant({
      restaurantId: "2",
      name: "restaurant2",
      phone: "123",
      address: "Mock Street",
      currentReserves: [
        ...this._reserves.filter((r) => r.restaurantId === "2"),
      ],
    }),
  ];

  public constructor() {}

  public async find(id: string): Promise<Reservation | null> {
    const result: Reservation | undefined = this._findById(id);

    if (!result) throw new EntityNotFoundError();

    return result;
  }

  public async findAvailReserves(
    restaurantId: string
  ): Promise<Reservation[] | null> {
    const restaurant = this._restaurants.find(
      (rs) => rs.restaurantId === restaurantId
    );

    if (!restaurant) throw new EntityNotFoundError();

    const result: Reservation[] = restaurant.currentReserves.filter(
      (r) => r.isPayed!
    );

    if (!result) throw new DataIntegrityError();

    return result;
  }

  public async findBookedReserves(
    restaurantId: string
  ): Promise<Reservation[] | null> {
    const restaurant = this._restaurants.find(
      (rs) => rs.restaurantId === restaurantId
    );

    if (!restaurant) throw new EntityNotFoundError();

    const result: Reservation[] = restaurant?.currentReserves.filter(
      (r) => r.isPayed
    );

    if (!result) throw new DataIntegrityError();

    return result;
  }

  public async findAttendReserves(
    restaurantId: string
  ): Promise<Reservation[] | null> {
    const restaurant = this._restaurants.find(
      (rs) => rs.restaurantId === restaurantId
    );

    if (!restaurant) throw new EntityNotFoundError();

    const result: Reservation[] = this._reserves.filter((r) => r.isAttended);

    if (!result) throw new DataIntegrityError();

    return result;
  }

  public async findAll(): Promise<Reservation[] | null> {
    const result = this._reserves ?? null;

    if (!result) throw new DataIntegrityError();

    return result;
  }

  public async save(reservation: Reservation): Promise<Reservation | null> {
    try {
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

  public async changeReserveDate(
    id: string,
    date: string
  ): Promise<Reservation | null> {
    const reservation: Reservation | undefined = this._findById(id);

    if (!reservation) throw new NotFoundError();

    reservation.reserveDate = date;
    return reservation;
  }

  public async update(
    id: string,
    data: Reservation
  ): Promise<Reservation | null> {
    const idx = this._reserves.findIndex((r) => r.reserveId === id);

    if (!indexFound(idx)) throw new NotFoundError();

    this._reserves[idx] = data;
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