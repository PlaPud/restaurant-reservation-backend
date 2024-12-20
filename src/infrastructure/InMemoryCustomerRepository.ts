import { STATUS_CODES } from "http";
import { Customer } from "../domain/Customer";
import { ICustomerRepository } from "./interfaces/ICustomerRepository";
import { EntityNotFoundError } from "../errors/DomainError";
import { DataIntegrityError, RepositoryError } from "../errors/RepositoryError";
import { injectable } from "inversify";

@injectable()
export class InMemoryCustomerRepository implements ICustomerRepository {
  private readonly _customers: Customer[] = [];

  public constructor() {}

  public async updateProfileImgPath(
    id: string,
    imgPath: string
  ): Promise<Customer | null> {
    throw new Error("Method not implemented.");
  }

  public async findByEmail(email: string): Promise<Customer | null> {
    const result = this._customers.find((c) => c.email === email) ?? null;

    if (!result)
      throw new EntityNotFoundError(`Cannot Find Customer (Email: ${email})`);

    return result;
  }

  public async find(id: string): Promise<Customer> {
    const result = this._customers.find((c) => c.customerId === id) ?? null;

    if (!result)
      throw new EntityNotFoundError(`Cannot Find Customer (ID: ${id})`);

    return result;
  }

  public async findMany(): Promise<Customer[]> {
    const result = this._customers ?? null;

    if (!result) throw new DataIntegrityError();

    return result;
  }

  public async update(id: string, data: Customer): Promise<Customer> {
    try {
      const idx = this._customers.findIndex((c) => c.customerId === id);

      if (!indexFound(idx))
        throw new EntityNotFoundError(`Cannot Find Customer (ID: ${id})`);

      this._customers[idx] = new Customer({
        customerId: this._customers[idx].customerId,
        fName: data.fName,
        lName: data.lName,
        email: data.email,
        phone: data.phone,
        hashPassword: data.hashPassword,
        reservation: this._customers[idx].reservation,
      });

      return this._customers[idx];
    } catch {
      throw new RepositoryError("Repository Error");
    }
  }

  public async save(customer: Customer): Promise<boolean> {
    try {
      this._customers.push(customer);
      return true;
    } catch {
      throw new RepositoryError("Repository Error");
    }
  }

  public async delete(id: string): Promise<boolean> {
    const idx = this._customers.findIndex((c) => c.customerId === id);

    if (!indexFound(idx))
      throw new EntityNotFoundError(`Cannot Find Customer (ID: ${id})`);

    this._customers.splice(idx, 1);

    return true;
  }

  public async deleteAll(): Promise<boolean> {
    try {
      this._customers.splice(0, this._customers.length);
      return true;
    } catch (err) {
      throw new RepositoryError("Repository Error");
    }
  }
}

const indexFound = (idx: number): boolean => idx > -1;
