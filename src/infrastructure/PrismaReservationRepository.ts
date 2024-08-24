import { Prisma, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Reservation } from "../domain/Reservation";
import { EntityNotFoundError } from "../errors/DomainError";
import { InternalServerError } from "../errors/HttpError";
import { RepositoryError } from "../errors/RepositoryError";
import { TYPES } from "../shared/inversify/types";
import { IReserveRepository } from "./interfaces/IReserveRepository";

@injectable()
export class PrismaReservationRepository implements IReserveRepository {
  public constructor(
    @inject(TYPES.PrismaClient)
    private readonly _client: PrismaClient
  ) {}

  public async find(id: string): Promise<Reservation | null> {
    const result = await this._client.reservation.findUnique({
      where: { reserveId: id },
      include: { restaurant: true, customer: true },
    });

    if (!result)
      throw new EntityNotFoundError(`Cannot find reservation (ID: ${id})`);

    return Reservation.fromJSON(result);
  }

  public async findAvailReserves(
    restaurantId: string
  ): Promise<Reservation[] | null> {
    const result = await this._client.restaurant.findUnique({
      where: { restaurantId: restaurantId },
      include: {
        currentReserves: {
          include: {
            customer: true,
            restaurant: true,
          },
        },
      },
    });

    if (!result)
      throw new EntityNotFoundError(
        `Cannot find restaurant (ID: ${restaurantId})`
      );

    const availResult = result.currentReserves.filter((r) => !r.isPayed);

    const data = availResult.map((obj) => Reservation.fromJSON(obj));

    return data;
  }

  public async findBookedReserves(
    restaurantId: string
  ): Promise<Reservation[] | null> {
    const result = await this._client.restaurant.findUnique({
      where: { restaurantId: restaurantId },
      include: {
        currentReserves: {
          include: {
            customer: true,
            restaurant: true,
          },
        },
      },
    });

    if (!result)
      throw new EntityNotFoundError(
        `Cannot find restaurant (ID: ${restaurantId})`
      );

    const bookReserves = result.currentReserves.filter((r) => r.isPayed);

    const data = bookReserves.map((obj) => Reservation.fromJSON(obj));

    return data;
  }

  public async findAttendReserves(
    restaurantId: string
  ): Promise<Reservation[] | null> {
    const result = await this._client.restaurant.findUnique({
      where: { restaurantId: restaurantId },
      include: {
        currentReserves: {
          include: {
            customer: true,
            restaurant: true,
          },
        },
      },
    });

    if (!result)
      throw new EntityNotFoundError(
        `Cannot find restaurant (ID: ${restaurantId})`
      );

    const bookReserves = result.currentReserves.filter((r) => r.isAttended);

    const data = bookReserves.map((obj) => Reservation.fromJSON(obj));

    return data;
  }

  public async findAll(): Promise<Reservation[] | null> {
    const result = await this._client.reservation.findMany({
      include: {
        restaurant: true,
        customer: true,
      },
    });

    return result.map((r) => Reservation.fromJSON(r));
  }

  public async save(reservation: Reservation): Promise<Reservation | null> {
    try {
      const { restaurantId, seats, reserveDate } = reservation;

      const result = await this._client.reservation.create({
        data: {
          restaurantId,
          seats,
          reserveDate: reserveDate.toString(),
        },
        include: {
          customer: true,
          restaurant: true,
        },
      });

      return Reservation.fromJSON(result);
    } catch (err) {
      console.log(err);
      throw getExternalError(err);
    }
  }

  public async update(
    id: string,
    data: Reservation
  ): Promise<Reservation | null> {
    try {
      const {
        reserveId,
        customer,
        restaurant,
        lastModified,
        options,
        ...rest
      } = data;

      const result = await this._client.reservation.update({
        where: {
          reserveId: id,
        },
        data: rest,
        include: {
          customer: true,
          restaurant: true,
        },
      });

      if (!result)
        throw new EntityNotFoundError(`Cannot find reservation (ID: ${id})`);

      return Reservation.fromJSON(result);
    } catch (err) {
      console.log(err);
      throw getExternalError(err, id);
    }
  }

  public async updateAttendance(
    id: string,
    isAttended: boolean
  ): Promise<Reservation | null> {
    try {
      const result = await this._client.reservation.update({
        where: {
          reserveId: id,
        },
        data: {
          isAttended,
        },
        include: {
          customer: true,
          restaurant: true,
        },
      });

      if (!result)
        throw new EntityNotFoundError(`Cannot find reservation (ID: ${id})`);

      return Reservation.fromJSON(result);
    } catch (err) {
      throw getExternalError(err, id);
    }
  }

  public async updatePaymentUrl(
    id: string,
    payImgUrl: string
  ): Promise<Reservation | null> {
    try {
      const result = await this._client.reservation.update({
        where: {
          reserveId: id,
        },
        data: {
          payImgUrl,
        },
        include: {
          customer: true,
          restaurant: true,
        },
      });

      if (!result)
        throw new EntityNotFoundError(`Cannot find reservation (ID: ${id})`);

      return Reservation.fromJSON(result);
    } catch (err) {
      throw getExternalError(err, id);
    }
  }

  public async updatePay(
    id: string,
    isPayed: boolean
  ): Promise<Reservation | null> {
    try {
      const result = await this._client.reservation.update({
        where: {
          reserveId: id,
        },
        data: {
          isPayed,
        },
        include: {
          customer: true,
          restaurant: true,
        },
      });

      if (!result)
        throw new EntityNotFoundError(`Cannot find reservation (ID: ${id})`);

      return Reservation.fromJSON(result);
    } catch (err) {
      throw getExternalError(err);
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this._client.reservation.delete({
        where: {
          reserveId: id,
        },
      });

      return result ? true : false;
    } catch (err) {
      throw getExternalError(err, id);
    }
  }

  public async deleteAll(): Promise<boolean> {
    try {
      const result = await this._client.reservation.deleteMany();
      return true;
    } catch (err) {
      throw getExternalError(err);
    }
  }
}

const isPrismaErr = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError;

function getExternalError(err: unknown, id?: string) {
  if (!isPrismaErr(err)) {
    return new InternalServerError();
  }

  if (id && err.code === "P2025")
    return new EntityNotFoundError(`Cannot Find Restaurant (ID: ${id})`);

  return new RepositoryError("Prisma Client Error.");
}