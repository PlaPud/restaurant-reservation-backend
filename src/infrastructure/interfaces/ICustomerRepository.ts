import { Customer } from "../../domain/Customer";

export interface ICustomerRepository {
  find(id: string): Promise<Customer | null>;

  findAll(): Promise<Customer[] | null>;

  update(id: string, data: Customer): Promise<Customer | null>;

  save(customer: Customer): Promise<boolean>;

  delete(id: string): Promise<boolean>;

  deleteAll(): Promise<boolean>;
}
