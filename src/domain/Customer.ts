import { randomUUID } from "crypto";
import { Reservation, ReservationObj } from "./Reservation";

export interface CustomerJSONResponse {
  customerId: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  profileImgPath: string;
  reservations?: ReservationObj[];
}

export interface CustomerObj extends CustomerJSONResponse {
  hashPassword: string;
}

export type CustomerConstrParams = {
  customerId?: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  hashPassword: string;
  isVerified?: boolean;
  profileImgPath?: string;
  reservations?: Reservation[];
};

export class Customer {
  public readonly customerId: string;
  public readonly fName: string;
  public readonly lName: string;
  public readonly email: string;
  public readonly phone: string;
  public readonly isVerified: boolean;
  public readonly hashPassword: string;
  public readonly profileImgPath: string;
  public readonly reservations?: Reservation[];

  public constructor(public readonly options: CustomerConstrParams) {
    this.customerId = this.options.customerId ?? randomUUID();
    this.reservations = this.options.reservations;
    this.fName = this.options.fName ?? "";
    this.lName = this.options.lName ?? "";
    this.email = this.options.email ?? "";
    this.phone = this.options.phone ?? "";
    this.hashPassword = this.options.hashPassword ?? "";
    this.profileImgPath = this.options.profileImgPath ?? "";
    this.isVerified = this.options.isVerified ?? false;
  }

  public static fromJSON(jsonObj: CustomerObj): Customer {
    return new Customer({
      customerId: jsonObj.customerId,
      fName: jsonObj.fName,
      lName: jsonObj.lName,
      email: jsonObj.email,
      phone: jsonObj.phone,
      isVerified: jsonObj.isVerified,
      hashPassword: jsonObj.hashPassword,
      profileImgPath: jsonObj.profileImgPath,
      reservations: jsonObj.reservations?.map((r) => Reservation.fromJSON(r)),
    });
  }

  public toObject(): CustomerObj {
    return {
      customerId: this.customerId,
      fName: this.fName,
      lName: this.lName,
      email: this.email,
      phone: this.phone,
      isVerified: this.isVerified,
      hashPassword: this.hashPassword,
      profileImgPath: this.profileImgPath,
      reservations: this.reservations?.map((r) => r.toObject()),
    };
  }

  public toJSONResponse(): CustomerJSONResponse {
    const { hashPassword, ...rest } = this.toObject();

    return rest;
  }
}
