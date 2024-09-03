import { randomUUID } from "crypto";
import { Customer, CustomerJSONResponse, CustomerObj } from "./Customer";
import {
  Restaurant,
  RestaurantJSONResponse,
  RestaurantObj,
} from "./Restaurant";

export interface ReservationObj {
  reserveId: string;
  customerId: string | null;
  restaurantId: string;
  lastModified: string | null;
  seats: number;
  reserveDate: string;
  payImgUrl: string | null;
  isPayed: boolean;
  isAttended: boolean;
  customer?: CustomerObj | null;
  restaurant?: RestaurantObj;
}

export interface ReservationJSONResponse {
  reserveId: string;
  customerId: string | null;
  restaurantId: string;
  lastModified: string | null;
  seats: number;
  reserveDate: string;
  payImgUrl: string | null;
  isPayed: boolean;
  isAttended: boolean;
  customer?: CustomerJSONResponse | null;
  restaurant?: RestaurantJSONResponse;
}

export type ReserveConstrParams = {
  reserveId?: string;
  customerId?: string | null;
  restaurantId: string;
  lastModified?: string | null;
  seats: number;
  reserveDate: string;
  payImgUrl?: string | null;
  isPayed?: boolean;
  isAttended?: boolean;
  customer?: Customer | null;
  restaurant?: Restaurant;
};

export class Reservation {
  public readonly reserveId: string = randomUUID();
  public customerId: string | null;
  public restaurantId: string;
  public lastModified: string;
  public seats: number = 2;
  public reserveDate: string = "";
  public payImgUrl: string | null;
  public isPayed: boolean = false;
  public isAttended: boolean = false;
  public customer?: Customer | null;
  public restaurant?: Restaurant;

  public constructor(public readonly options: ReserveConstrParams) {
    this.reserveId = this.options.reserveId ?? randomUUID();
    this.customerId = this.options.customerId ?? null;
    this.restaurantId = this.options.restaurantId ?? "";
    this.lastModified =
      this.options.lastModified ?? new Date(Date.now()).toISOString();
    this.seats = this.options.seats ?? 2;
    this.reserveDate = this.options.reserveDate ?? "";
    this.payImgUrl = this.options.payImgUrl ?? null;
    this.isPayed = this.options.isPayed ?? false;
    this.isAttended = this.options.isAttended ?? false;
    this.customer = this.options.customer;
    this.restaurant = this.options.restaurant;
  }

  public static fromJSON(jsonObj: ReservationObj): Reservation {
    return new Reservation({
      reserveId: jsonObj.reserveId,
      customerId: jsonObj.customerId,
      restaurantId: jsonObj.restaurantId,
      lastModified: jsonObj.lastModified,
      seats: jsonObj.seats,
      reserveDate: jsonObj.reserveDate,
      payImgUrl: jsonObj.payImgUrl,
      isPayed: jsonObj.isPayed,
      isAttended: jsonObj.isAttended,
      customer: jsonObj.customer
        ? Customer.fromJSON(jsonObj.customer)
        : undefined,
      restaurant: jsonObj.restaurant
        ? Restaurant.fromJSON(jsonObj.restaurant)
        : undefined,
    });
  }

  public toObject(): ReservationObj {
    return {
      reserveId: this.reserveId,
      customerId: this.customerId,
      restaurantId: this.restaurantId,
      lastModified: this.lastModified,
      seats: this.seats,
      reserveDate: this.reserveDate,
      payImgUrl: this.payImgUrl,
      isPayed: this.isPayed,
      isAttended: this.isAttended,
      customer: this.customer ? this.customer.toObject() : undefined,
      restaurant: this.restaurant ? this.restaurant.toObject() : undefined,
    };
  }

  public toJSONResponse(): ReservationJSONResponse {
    const { customer, restaurant, ...rest } = this.toObject();

    return {
      ...rest,
      customer: this.customer ? this.customer.toJSONResponse() : undefined,
      restaurant: this.restaurant
        ? this.restaurant.toJSONResponse()
        : undefined,
    };
  }
}
