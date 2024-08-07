import { Prisma, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Customer } from "../domain/Customer";
import { EntityNotFoundError } from "../errors/DomainError";
import { InternalServerError } from "../errors/HttpError";
import { RepositoryError } from "../errors/RepositoryError";
import { TYPES } from "../shared/inversify/types";
import { ICustomerRepository } from "./interfaces/ICustomerRepository";

@injectable()
export class PrismaCustomerRepository implements ICustomerRepository {
  public constructor(
    @inject(TYPES.PrismaClient)
    private readonly _client: PrismaClient
  ) {}

  public async find(id: string): Promise<Customer> {
    const result = await this._client.customer.findUnique({
      where: { customerId: id },
      include: {
        reservations: true,
      },
    });

    if (!result)
      throw new EntityNotFoundError(`Cannot Find Customer (ID: ${id})`);

    return Customer.fromJSON(result);
  }

  public async findAll(): Promise<Customer[]> {
    const results = await this._client.customer.findMany({
      include: {
        reservations: true,
      },
    });

    return results.map((obj) => Customer.fromJSON(obj));
  }

  public async save(customer: Customer): Promise<boolean> {
    try {
      const { fName, lName, email, phone } = customer.toJSON();
      const result = await this._client.customer.create({
        data: {
          fName: fName,
          lName: lName,
          email: email,
          phone: phone,
        },
      });
      return true;
    } catch (err) {
      if (!isPrismaErr(err)) throw new InternalServerError("Cannot Save Data.");

      throw new RepositoryError("Repository Error");
    }
  }
  public async update(id: string, data: Customer): Promise<Customer> {
    try {
      const { fName, lName, email, phone } = data.toJSON();
      const result = await this._client.customer.update({
        where: { customerId: id },
        data: {
          fName,
          lName,
          email,
          phone,
        },
        include: { reservations: true },
      });

      return data;
    } catch (err) {
      if (!isPrismaErr(err))
        throw new InternalServerError("Cannot Update Data");

      if (err.code === "P2025")
        throw new EntityNotFoundError(`Cannot Find Customer (ID: ${id})`);

      throw new RepositoryError("Repository Error");
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this._client.customer.delete({
        where: { customerId: id },
      });
      return result ? true : false;
    } catch (err) {
      if (!isPrismaErr(err))
        throw new InternalServerError("Cannot Update Data");

      if (err.code === "P2025")
        throw new EntityNotFoundError(`Cannot Find Customer (ID: ${id})`);

      throw new RepositoryError("Repository Error");
    }
  }

  public async deleteAll(): Promise<boolean> {
    try {
      const result = await this._client.customer.deleteMany();
      return true;
    } catch (err) {
      if (!isPrismaErr(err))
        throw new InternalServerError("Cannot Update Data");

      throw new RepositoryError("Repository Error");
    }
  }
}

const isPrismaErr = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError;
