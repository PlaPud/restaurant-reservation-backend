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

@injectable()
export class PrismaRestaurantRepository implements IRestaurantRepository {
  public constructor(
    @inject(TYPES.PrismaClient)
    private readonly _client: PrismaClient
  ) {}

  public async find(id: string): Promise<Restaurant | null> {
    const result = await this._client.restaurant.findUnique({
      where: { restaurantId: id },
      include: {
        currentReserves: true,
      },
    });

    if (!result)
      throw new EntityNotFoundError(`Cannot Find Restaurant (ID: ${id})`);

    return Restaurant.fromJSON(result);
  }
  public async findAll(): Promise<Restaurant[]> {
    const results = await this._client.restaurant.findMany({
      include: {
        currentReserves: true,
      },
    });

    return results.map((rs) => Restaurant.fromJSON(rs));
  }

  public async save(restaurant: Restaurant): Promise<Restaurant | null> {
    try {
      const { name, phone, address } = restaurant.toJSON();
      const result = await this._client.restaurant.create({
        data: {
          name,
          phone,
          address,
        },
        include: {
          currentReserves: true,
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
      const { name, phone, address } = data.toJSON();
      const result = await this._client.restaurant.update({
        where: { restaurantId: id },
        data: {
          name,
          phone,
          address,
        },
        include: { currentReserves: true },
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
