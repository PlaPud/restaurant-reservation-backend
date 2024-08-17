import { randomUUID } from "crypto";
import { Reservation, ReservationJSON } from "./Reservation";

export interface CustomerJSON {
  customerId: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  reservations: ReservationJSON[];
}

export type CustomerConstrParams = {
  customerId?: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  reservations?: Reservation[];
};

export class Customer {
  public readonly customerId: string;
  public readonly fName: string;
  public readonly lName: string;
  public readonly email: string;
  public readonly phone: string;
  public readonly reservations: Reservation[];

  public constructor(private readonly _options: CustomerConstrParams) {
    this.customerId = this._options.customerId ?? randomUUID();
    this.reservations = this._options.reservations ?? [];
    this.fName = this._options.fName ?? "";
    this.lName = this._options.lName ?? "";
    this.email = this._options.email ?? "";
    this.phone = this._options.phone ?? "";
  }

  public static fromJSON(jsonObj: CustomerJSON): Customer {
    return new Customer({
      customerId: jsonObj.customerId,
      fName: jsonObj.fName,
      lName: jsonObj.lName,
      email: jsonObj.email,
      phone: jsonObj.phone,
      reservations: jsonObj.reservations?.map((r) => Reservation.fromJSON(r)),
    });
  }

  public toJSON(): CustomerJSON {
    return {
      customerId: this.customerId,
      fName: this.fName,
      lName: this.lName,
      email: this.email,
      phone: this.phone,
      reservations: this.reservations.map((r) => r.toJSON()),
    };
  }
}
