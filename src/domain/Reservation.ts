import { randomUUID } from "crypto";
import { Customer, CustomerJSON } from "./Customer";
import { Restaurant, RestaurantJSON } from "./Restaurant";

export interface ReservationJSON {
  reserveId: string;
  customerId: string;
  restaurantId: string;
  date: string;
  seats: number;
  reserveDate: string;
  payImgUrl: string;
  isPayed: boolean;
  isAttended: boolean;
  customer?: CustomerJSON;
  restaurant?: RestaurantJSON;
}

export type ReserveConstrParams = {
  reserveId?: string;
  customerId?: string;
  restaurantId: string;
  date?: string;
  seats: number;
  reserveDate: string;
  payImgUrl?: string;
  isPayed?: boolean;
  isAttended?: boolean;
  customer?: Customer;
  restaurant?: Restaurant;
};

export class Reservation {
  public readonly reserveId: string = randomUUID();
  public customerId: string;
  public restaurantId: string;
  public date: string;
  public seats: number = 2;
  public reserveDate: string = "";
  public payImgUrl: string = "";
  public isPayed: boolean = false;
  public isAttended: boolean = false;
  public customer?: Customer;
  public restaurant?: Restaurant;

  public constructor(private readonly _options: ReserveConstrParams) {
    this.reserveId = this._options.reserveId ?? randomUUID();
    this.customerId = this._options.customerId ?? "";
    this.restaurantId = this._options.restaurantId ?? "";
    this.date = this._options.date ?? Date.now().toString();
    this.seats = this._options.seats ?? 2;
    this.reserveDate = this._options.reserveDate ?? "";
    this.payImgUrl = this._options.payImgUrl ?? "";
    this.isPayed = this._options.isPayed ?? false;
    this.isAttended = this._options.isAttended ?? false;
    this.customer = this._options.customer;
    this.restaurant = this._options.restaurant;
  }

  public static fromJSON(jsonObj: ReservationJSON): Reservation {
    return new Reservation({
      reserveId: jsonObj.reserveId,
      customerId: jsonObj.customerId,
      restaurantId: jsonObj.restaurantId,
      date: jsonObj.date,
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

  public toJSON(): ReservationJSON {
    return {
      reserveId: this.reserveId,
      customerId: this.customerId,
      restaurantId: this.restaurantId,
      date: this.date,
      seats: this.seats,
      reserveDate: this.reserveDate,
      payImgUrl: this.payImgUrl,
      isPayed: this.isPayed,
      isAttended: this.isAttended,
      customer: this.customer ? this.customer.toJSON() : undefined,
      restaurant: this.restaurant ? this.restaurant.toJSON() : undefined,
    };
  }
}
