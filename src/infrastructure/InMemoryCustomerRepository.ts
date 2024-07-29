import { STATUS_CODES } from "http";
import { Customer } from "../domain/Customer";
import { ICustomerRepository } from "../shared/ICustomerRepository";
import { EntityNotFoundError } from "../errors/DomainError";
import { DataIntegrityError, RepositoryError } from "../errors/RepositoryError";
import { injectable } from "inversify";

@injectable()
export class InMemoryCustomerRepository implements ICustomerRepository {
  private readonly _customers: Customer[] = [];

  public constructor() {}

  public async find(id: string): Promise<Customer> {
    const result = this._customers.find((c) => c.customerId === id) ?? null;

    if (!result)
      throw new EntityNotFoundError(`Cannot Find Customer (ID: ${id})`);

    return result;
  }

  public async findAll(): Promise<Customer[]> {
    const result = this._customers ?? null;

    if (!result) throw new DataIntegrityError();

    return result;
  }

  public async update(id: string, data: Customer): Promise<Customer> {
    try {
      const idx = this._customers.findIndex((c) => c.customerId === id);

      if (!indexFound(idx))
        throw new EntityNotFoundError(`Cannot Find Customer (ID: ${id})`);

      this._customers[idx] = new Customer(
        this._customers[idx].customerId,
        data.fName,
        data.lName,
        data.email,
        data.phone,
        this._customers[idx].reservations
      );

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
