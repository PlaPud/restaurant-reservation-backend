import { randomUUID } from "crypto";
import { Reservation, ReservationObj } from "./Reservation";

export interface RestaurantJSONResponse {
  restaurantId: string;
  name: string;
  phone: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  email: string;
  isVerified: boolean;
  profileImgPath: string;
  description: string;
  paymentInfo: string;
  reservation?: ReservationObj[];
}

export interface RestaurantObj extends RestaurantJSONResponse {
  hashPassword: string;
}

export type RestaurantConstrParams = {
  restaurantId?: string;
  name: string;
  phone: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  email: string;
  isVerified?: boolean;
  hashPassword: string;
  profileImgPath?: string;
  description?: string;
  paymentInfo?: string;
  reservation?: Reservation[];
};

export class Restaurant {
  public readonly restaurantId: string = randomUUID();
  public readonly name: string;
  public readonly phone: string;
  public readonly address: string;
  public readonly subDistrict: string;
  public readonly district: string;
  public readonly province: string;
  public readonly email: string;
  public readonly isVerified: boolean;
  public readonly hashPassword: string;
  public readonly profileImgPath: string;
  public readonly description: string;
  public readonly paymentInfo: string;
  public readonly reservation?: Reservation[];

  public constructor(public readonly options: RestaurantConstrParams) {
    this.restaurantId = this.options.restaurantId ?? randomUUID();
    this.name = this.options.name ?? "";
    this.phone = this.options.phone ?? "";
    this.address = this.options.address ?? "";
    this.subDistrict = this.options.subDistrict ?? "";
    this.district = this.options.district ?? "";
    this.province = this.options.province ?? "";
    this.isVerified = this.options.isVerified ?? false;
    this.email = this.options.email ?? "";
    this.hashPassword = this.options.hashPassword ?? "";
    this.description = this.options.description ?? "";
    this.paymentInfo = this.options.paymentInfo ?? "";
    this.profileImgPath = this.options.profileImgPath ?? "";
    this.reservation = this.options.reservation;
  }

  public static fromJSON(jsonObj: RestaurantObj): Restaurant {
    return new Restaurant({
      restaurantId: jsonObj.restaurantId,
      name: jsonObj.name,
      phone: jsonObj.phone,
      address: jsonObj.address,
      subDistrict: jsonObj.subDistrict,
      district: jsonObj.district,
      province: jsonObj.province,
      email: jsonObj.email,
      hashPassword: jsonObj.hashPassword,
      isVerified: jsonObj.isVerified,
      profileImgPath: jsonObj.profileImgPath,
      description: jsonObj.description,
      paymentInfo: jsonObj.paymentInfo,
      reservation: jsonObj.reservation?.map((rsObj) =>
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
      subDistrict: this.subDistrict,
      district: this.district,
      province: this.province,
      email: this.email,
      isVerified: this.isVerified,
      hashPassword: this.hashPassword,
      profileImgPath: this.profileImgPath,
      description: this.description,
      paymentInfo: this.paymentInfo,
      reservation: this.reservation?.map((rs) => rs.toObject()),
    };
  }

  public toJSONResponse(): RestaurantJSONResponse {
    const { hashPassword, ...rest } = this.toObject();
    return rest;
  }
}
