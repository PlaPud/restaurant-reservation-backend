import { Prisma, PrismaClient } from "@prisma/client";
import { id, inject, injectable } from "inversify";
import "reflect-metadata";
import { Reservation } from "../domain/Reservation";
import { EntityNotFoundError } from "../errors/DomainError";
import { InternalServerError } from "../errors/HttpError";
import { RepositoryError } from "../errors/RepositoryError";
import { TYPES } from "../shared/inversify/types";
import {
  IReserveRepository,
  ReservationWithCount,
} from "./interfaces/IReserveRepository";
import { PAGE_SIZE } from "../shared/constants";
import { startOfDay } from "date-fns";
import { getReservationCutOffTime } from "../shared/utilsFunc";

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
    restaurantId: string,
    page: number
  ): Promise<ReservationWithCount | null> {
    const queryCondition = {
      AND: {
        restaurantId: restaurantId,
        payImgUrl: "",
        reserveDate: {
          gte: getReservationCutOffTime(),
        },
      },
    };

    const [count, result] = await Promise.all([
      this._client.reservation.count({ where: queryCondition }),
      this._client.reservation.findMany({
        skip: PAGE_SIZE * (page - 1),
        take: PAGE_SIZE,
        where: queryCondition,
        include: {
          customer: true,
          restaurant: true,
        },
      }),
    ]);

    const data = result.map((obj) => Reservation.fromJSON(obj));

    return { count, data };
  }

  public async findPendingReserves(
    page: number,
    searchQuery: string,
    restaurantId?: string,
    customerId?: string
  ): Promise<ReservationWithCount | null> {
    const queryCondition = {
      AND: {
        customerId: {
          not: null,
        },
        ...this.buildIdCondition(customerId, restaurantId),
        isPayed: false,
        reserveDate: {
          gte: getReservationCutOffTime(),
        },
      },
      ...this.buildSearchQuery(searchQuery),
    };

    const [count, result] = await Promise.all([
      this._client.reservation.count({
        where: queryCondition,
      }),
      this._client.reservation.findMany({
        skip: PAGE_SIZE * (page - 1),
        take: PAGE_SIZE,
        where: queryCondition,
        include: {
          customer: true,
          restaurant: true,
        },
      }),
    ]);

    const data = result.map((obj) => Reservation.fromJSON(obj));

    return { count, data };
  }

  public async findBookedReserves(
    page: number,
    searchQuery: string,
    restaurantId?: string,
    customerId?: string
  ): Promise<ReservationWithCount | null> {
    const queryCondition = {
      AND: {
        ...this.buildIdCondition(customerId, restaurantId),
        isPayed: true,
        isAttended: false,
        reserveDate: {
          gte: getReservationCutOffTime(),
        },
      },
      ...this.buildSearchQuery(searchQuery),
    };

    const [count, result] = await Promise.all([
      this._client.reservation.count({
        where: queryCondition,
      }),
      this._client.reservation.findMany({
        skip: PAGE_SIZE * (page - 1),
        take: PAGE_SIZE,
        where: queryCondition,
        include: {
          customer: true,
          restaurant: true,
        },
      }),
    ]);

    const data = result.map((obj) => Reservation.fromJSON(obj));

    return { count, data };
  }

  public async findAttendAndLateReserves(
    page: number,
    searchQuery: string,
    restaurantId?: string,
    customerId?: string
  ): Promise<ReservationWithCount | null> {
    const idCondition = this.buildIdCondition(customerId, restaurantId);

    const queryCondition = {
      AND: {
        OR: [
          {
            ...idCondition,
            isAttended: true,
          },
          {
            ...idCondition,
            reserveDate: {
              lt: getReservationCutOffTime(),
            },
          },
        ],
      },
      ...this.buildSearchQuery(searchQuery),
    };

    const [count, result] = await Promise.all([
      this._client.reservation.count({
        where: queryCondition,
      }),
      this._client.reservation.findMany({
        skip: PAGE_SIZE * (page - 1),
        take: PAGE_SIZE,
        where: queryCondition,
        include: {
          customer: true,
          restaurant: true,
        },
      }),
    ]);

    const data = result.map((obj) => Reservation.fromJSON(obj));

    return { count, data };
  }

  public async findMany(
    page: number,
    searchQuery: string,
    restaurantId?: string,
    customerId?: string
  ): Promise<ReservationWithCount | null> {
    const idCondition = this.buildIdCondition(customerId, restaurantId);
    const searchCondition = this.buildSearchQuery(searchQuery);

    const [count, result] = await Promise.all([
      this._client.reservation.count({
        where: { ...idCondition, ...searchCondition },
      }),
      this._client.reservation.findMany({
        skip: PAGE_SIZE * (page - 1),
        take: PAGE_SIZE,
        where: { ...idCondition, ...searchCondition },
        include: {
          restaurant: true,
          customer: true,
        },
      }),
    ]);

    const data = result.map((r) => Reservation.fromJSON(r));

    return { count, data };
  }

  public async save(reservation: Reservation): Promise<Reservation | null> {
    try {
      const { reserveId, restaurantId, seats, reserveDate, reservePrice } =
        reservation;

      const result = await this._client.reservation.create({
        data: {
          reserveId,
          restaurantId,
          seats,
          reserveDate,
          reservePrice,
        },
        include: {
          customer: true,
          restaurant: true,
        },
      });

      return Reservation.fromJSON(result);
    } catch (err) {
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

  public async makeReservation(
    id: string,
    customerId: string
  ): Promise<Reservation | null> {
    try {
      const result = await this._client.reservation.update({
        where: {
          reserveId: id,
        },
        data: {
          customerId,
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

  public async cancelReservation(id: string): Promise<Reservation | null> {
    try {
      const result = await this._client.reservation.update({
        where: {
          reserveId: id,
        },
        data: {
          lastModified: Math.floor(Date.now() / 1000),
          customerId: null,
          isAttended: false,
          isPayed: false,
          payImgUrl: "",
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
    payImgUrl: string,
    payImg?: FormData
  ): Promise<Reservation | null> {
    try {
      const result = await this._client.reservation.update({
        where: {
          reserveId: id,
        },
        data: {
          payImgUrl,
          lastModified: Math.floor(Date.now() / 1000),
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

  private buildIdCondition(customerId?: string, restaurantId?: string) {
    return {
      ...(restaurantId ? { restaurantId } : {}),
      ...(customerId ? { customerId } : {}),
    };
  }

  private buildSearchQuery(searchQuery: string): Prisma.reservationWhereInput {
    if (searchQuery === "") return {};

    return {
      OR: [
        {
          customer: {
            fName: {
              contains: searchQuery,
            },
          },
        },
        {
          customer: {
            lName: {
              contains: searchQuery,
            },
          },
        },
      ],
    };
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
