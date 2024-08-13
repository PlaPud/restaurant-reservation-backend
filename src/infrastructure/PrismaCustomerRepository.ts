import "reflect-metadata";
import { Prisma, PrismaClient } from "@prisma/client";
import { Customer } from "../domain/Customer";
import { ICustomerRepository } from "../shared/ICustomerRepository";
import { EntityNotFoundError } from "../errors/DomainError";
import { DataIntegrityError, RepositoryError } from "../errors/RepositoryError";
import { InternalServerError } from "../errors/HttpError";
import { inject, injectable } from "inversify";
import { TYPES } from "../shared/types";

@injectable()
export class PrismaCustomerRepository implements ICustomerRepository {
  public constructor(
    @inject(TYPES.PrismaClient)
    private readonly _client: PrismaClient
  ) {}

  public async find(id: string): Promise<Customer> {
    const result = await this._client.customer.findUnique({
      where: { customerId: id },
    });

    if (!result)
      throw new EntityNotFoundError(`Cannot Find Customer (ID: ${id})`);

    return Customer.fromJSON(result);
  }

  public async findAll(): Promise<Customer[]> {
    const results = await this._client.customer.findMany();

    if (results.length === 0) throw new EntityNotFoundError();

    return results.map((obj) => Customer.fromJSON(obj));
  }

  public async save(customer: Customer): Promise<boolean> {
    try {
      const result = await this._client.customer.create({
        data: customer.toJSON(),
      });
      return true;
    } catch (err) {
      if (!isPrismaErr(err)) throw new InternalServerError("Cannot Save Data.");

      throw new RepositoryError("Repository Error");
    }
  }

  public async update(id: string, data: Customer): Promise<Customer> {
    try {
      const result = await this._client.customer.update({
        where: { customerId: id },
        data: data.toJSON(),
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
