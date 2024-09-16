import { randomUUID } from "crypto";
import { Reservation, ReservationObj } from "./Reservation";

export interface RestaurantJSONResponse {
  restaurantId: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  isVerified: boolean;
  profileImgPath: string;
  description: string;
  currentReserves?: ReservationObj[];
}

export interface RestaurantObj extends RestaurantJSONResponse {
  hashPassword: string;
}

export type RestaurantConstrParams = {
  restaurantId?: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  isVerified?: boolean;
  hashPassword: string;
  profileImgPath?: string;
  description?: string;
  currentReserves?: Reservation[];
};

export class Restaurant {
  public readonly restaurantId: string = randomUUID();
  public readonly name: string;
  public readonly phone: string;
  public readonly address: string;
  public readonly email: string;
  public readonly isVerified: boolean;
  public readonly hashPassword: string;
  public readonly profileImgPath: string;
  public readonly description: string;
  public readonly currentReserves?: Reservation[];

  public constructor(public readonly options: RestaurantConstrParams) {
    this.restaurantId = this.options.restaurantId ?? randomUUID();
    this.name = this.options.name ?? "";
    this.phone = this.options.phone ?? "";
    this.address = this.options.address ?? "";
    this.isVerified = this.options.isVerified ?? false;
    this.email = this.options.email ?? "";
    this.hashPassword = this.options.hashPassword ?? "";
    this.description = this.options.description ?? "";
    this.profileImgPath = this.options.profileImgPath ?? "";
    this.currentReserves = this.options.currentReserves;
  }

  public static fromJSON(jsonObj: RestaurantObj): Restaurant {
    return new Restaurant({
      restaurantId: jsonObj.restaurantId,
      name: jsonObj.name,
      phone: jsonObj.phone,
      address: jsonObj.address,
      email: jsonObj.email,
      hashPassword: jsonObj.hashPassword,
      isVerified: jsonObj.isVerified,
      profileImgPath: jsonObj.profileImgPath,
      description: jsonObj.description,
      currentReserves: jsonObj.currentReserves?.map((rsObj) =>
        Reservation.fromJSON(rsObj)
      ),
    });
  }

  public toObject(): RestaurantObj {
    return {
      restaurantId: this.restaurantId,
      name: this.name,
      phone: this.phone,
      address: this.address,
      email: this.email,
      isVerified: this.isVerified,
      hashPassword: this.hashPassword,
      profileImgPath: this.profileImgPath,
      description: this.description,
      currentReserves: this.currentReserves?.map((rs) => rs.toObject()),
    };
  }

  public toJSONResponse(): RestaurantJSONResponse {
    const { hashPassword, ...rest } = this.toObject();
    return rest;
  }
}
