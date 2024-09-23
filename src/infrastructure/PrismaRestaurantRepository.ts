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
        reservation: true,
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
        reservation: true,
      },
    });

    if (!result)
      throw new EntityNotFoundError(`Cannot Find Restaurant (Email: ${email})`);

    return Restaurant.fromJSON(result);
  }

  public async findMany(
    page: number,
    filterBy: IFilterRestaurant | null
  ): Promise<Restaurant[]> {
    const results = await this._client.restaurant.findMany({
      skip: PAGE_SIZE * (page - 1),
      take: PAGE_SIZE,
      where: filterBy ? filterBy : {},
      include: {
        reservation: true,
      },
    });

    return results.map((rs) => Restaurant.fromJSON(rs));
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
      const { name, phone, address, description, hashPassword } =
        data.toObject();
      const result = await this._client.restaurant.update({
        where: { restaurantId: id },
        data: {
          name,
          phone,
          address,
          description,
          hashPassword,
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
