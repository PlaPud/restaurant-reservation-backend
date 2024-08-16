import { Reservation } from "../domain/Reservation";
import { EntityNotFoundError } from "../errors/DomainError";
import { NotFoundError } from "../errors/HttpError";
import { DataIntegrityError, RepositoryError } from "../errors/RepositoryError";
import { IReserveRepository } from "./interfaces/IReserveRepository";

export class InMemoryReserveRepository implements IReserveRepository {
  private readonly _reserves: Reservation[] = [];

  public constructor() {}

  public async find(id: string): Promise<Reservation | null> {
    const result: Reservation | undefined = this._findById(id);

    if (!result) throw new EntityNotFoundError();

    return result;
  }

  public async findAvailReserves(
    restaurantId: string
  ): Promise<Reservation[] | null> {
    const result: Reservation[] = this._reserves.filter((r) => r.isPayed!);

    if (!result) throw new DataIntegrityError();

    return result;
  }

  public async findBookedReserves(
    restaurantId: string
  ): Promise<Reservation[] | null> {
    const result: Reservation[] = this._reserves.filter((r) => r.isPayed);

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
