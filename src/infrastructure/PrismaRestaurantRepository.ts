import "reflect-metadata";
import { Prisma, PrismaClient } from "@prisma/client";
import { Restaurant } from "../domain/Restaurant";
import { IRestaurantRepository } from "./interfaces/IRestaurantRepository";
import { EntityNotFoundError } from "../errors/DomainError";
import { InternalServerError } from "../errors/HttpError";
import { RepositoryError } from "../errors/RepositoryError";
import { inject, injectable } from "inversify";
import { RESTAURANT_T } from "../shared/inversify/restaurant.types";
import { TYPES } from "../shared/inversify/types";
import { IFilterRestaurant } from "../shared/searchFilter";
import { PAGE_SIZE } from "../shared/constants";
import { getReservationCutOffTime } from "../shared/utilsFunc";

@injectable()
export class PrismaRestaurantRepository implements IRestaurantRepository {
  public constructor(
    @inject(TYPES.PrismaClient)
    private readonly _client: PrismaClient
  ) {}

  public async updateProfileImgPath(
    id: string,
    imgPath: string
  ): Promise<Restaurant | null> {
    try {
      const result = await this._client.restaurant.update({
        where: {
          restaurantId: id,
        },
        data: {
          profileImgPath: imgPath,
        },
      });

      return Restaurant.fromJSON(result);
    } catch (err) {
      throw getExternalError(err, id);
    }
  }

  public async find(id: string): Promise<Restaurant | null> {
    const result = await this._client.restaurant.findUnique({
      where: { restaurantId: id },
      include: {
        reservation: {
          orderBy: { reserveDate: "asc" },
          where: {
            customerId: null,
            reserveDate: {
              gte: getReservationCutOffTime(),
            },
          },
        },
      },
    });

    if (!result)
      throw new EntityNotFoundError(`Cannot Find Restaurant (ID: ${id})`);

    return Restaurant.fromJSON(result);
  }

  public async findByEmail(email: string): Promise<Restaurant | null> {
    const result = await this._client.restaurant.findUnique({
      where: { email },
      include: {
        reservation: {
          where: {
            customerId: null,
            reserveDate: {
              gte: getReservationCutOffTime(),
            },
          },
        },
      },
    });

    if (!result)
      throw new EntityNotFoundError(`Cannot Find Restaurant (Email: ${email})`);

    return Restaurant.fromJSON(result);
  }

  public async findMany(
    page: number,
    searchQuery?: string,
    filterBy?: IFilterRestaurant | null
  ): Promise<Restaurant[]> {
    const where: Prisma.restaurantWhereInput = {
      ...(searchQuery
        ? {
            name: {
              contains: searchQuery,
            },
          }
        : {}),
      ...(filterBy
        ? {
            province: {
              contains: filterBy.province,
            },
            district: {
              contains: filterBy.district,
            },
            subDistrict: { contains: filterBy.subDistrict },
          }
        : {}),
    };

    const results = await this._client.restaurant.findMany({
      skip: PAGE_SIZE * (page - 1),
      take: PAGE_SIZE,
      where,
      include: {
        reservation: {
          where: {
            customerId: null,
            reserveDate: {
              gte: getReservationCutOffTime(),
            },
          },
        },
      },
    });

    return results.map((rs) => Restaurant.fromJSON(rs));
  }

  public async getRecordsCount(
    page: number,
    searchQuery?: string,
    filterBy?: IFilterRestaurant | null
  ): Promise<number> {
    const where: Prisma.restaurantWhereInput = {
      ...(searchQuery
        ? {
            name: {
              contains: searchQuery,
            },
          }
        : {}),
      ...(filterBy
        ? {
            province: {
              contains: filterBy.province,
            },
            district: {
              contains: filterBy.district,
            },
            subDistrict: { contains: filterBy.subDistrict },
          }
        : {}),
    };

    const result = await this._client.restaurant.count({
      where,
    });

    return result;
  }

  public async save(restaurant: Restaurant): Promise<Restaurant | null> {
    try {
      const {
        restaurantId,
        name,
        phone,
        address,
        province,
        district,
        subDistrict,
        email,
        hashPassword,
      } = restaurant.toObject();
      const result = await this._client.restaurant.create({
        data: {
          restaurantId,
          name,
          phone,
          address,
          province,
          district,
          subDistrict,
          email,
          hashPassword,
        },
        include: {
          reservation: true,
        },
      });
      return Restaurant.fromJSON(result);
    } catch (err) {
      throw getExternalError(err);
    }
  }
  public async update(
    id: string,
    data: Restaurant
  ): Promise<Restaurant | null> {
    try {
      const {
        name,
        phone,
        address,
        subDistrict,
        district,
        province,
        description,
        paymentInfo,
      } = data.toObject();
      const result = await this._client.restaurant.update({
        where: { restaurantId: id },
        data: {
          name,
          phone,
          address,
          subDistrict,
          district,
          province,
          description,
          paymentInfo,
        },
        include: { reservation: true },
      });

      return Restaurant.fromJSON(result);
    } catch (err) {
      throw getExternalError(err, id);
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this._client.restaurant.delete({
        where: { restaurantId: id },
      });
      return result ? true : false;
    } catch (err) {
      throw getExternalError(err, id);
    }
  }
  public async deleteAll(): Promise<boolean> {
    try {
      const result = await this._client.restaurant.deleteMany();
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
