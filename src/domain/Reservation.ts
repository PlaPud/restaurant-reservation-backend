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

export class Reservation {
  public constructor(
    public readonly reserveId: string = randomUUID(),
    public customerId: string,
    public restaurantId: string,
    public date: string = Date.now().toString(),
    public seats: number = 2,
    public reserveDate: string = "",
    public payImgUrl: string = "",
    public isPayed: boolean = false,
    public isAttended: boolean = false,
    public customer?: Customer,
    public restaurant?: Restaurant
  ) {}

  public static fromJSON(jsonObj: ReservationJSON): Reservation {
    return new Reservation(
      jsonObj.reserveId,
      jsonObj.customerId,
      jsonObj.restaurantId,
      jsonObj.date,
      jsonObj.seats,
      jsonObj.reserveDate,
      jsonObj.payImgUrl,
      jsonObj.isPayed,
      jsonObj.isAttended,
      jsonObj.customer ? Customer.fromJSON(jsonObj.customer) : undefined,
      jsonObj.restaurant ? Restaurant.fromJSON(jsonObj.restaurant) : undefined
    );
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
