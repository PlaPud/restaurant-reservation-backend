import { randomUUID } from "crypto";
import { Reservation } from "./Reservation";

export interface CustomerJSON {
  customerId: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  reservations: number;
}

export class Customer {
  public constructor(
    public readonly customerId: string = randomUUID(),
    public readonly fName: string,
    public readonly lName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly reservations: number = 0
  ) {}

  public static fromJSON(jsonObj: CustomerJSON): Customer {
    return new Customer(
      jsonObj.customerId,
      jsonObj.fName,
      jsonObj.lName,
      jsonObj.email,
      jsonObj.phone,
      jsonObj.reservations
    );
  }

  public toJSON(): CustomerJSON {
    return {
      customerId: this.customerId,
      fName: this.fName,
      lName: this.lName,
      email: this.email,
      phone: this.phone,
      reservations: this.reservations,
    };
  }
}
