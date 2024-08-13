import { randomUUID } from "crypto";
import { Customer, CustomerJSON } from "./Customer";
import { Restaurant, RestaurantJSON } from "./Restaurant";

export interface ReservationJSON {
  reserveId: string;
  customerId: string;
  restaurantId: string;
  date: string;
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
    public readonly customerId: string,
    public readonly restaurantId: string,
    public readonly date: string = Date.now().toString(),
    public readonly reserveDate: string = "",
    public readonly payImgUrl: string = "",
    public readonly isPayed: boolean = false,
    public readonly isAttended: boolean = false,
    public readonly customer?: Customer,
    public readonly restaurant?: Restaurant
  ) {}

  public static fromJSON(jsonObj: ReservationJSON): Reservation {
    return new Reservation(
      jsonObj.reserveId,
      jsonObj.customerId,
      jsonObj.restaurantId,
      jsonObj.date,
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
      reserveDate: this.reserveDate,
      payImgUrl: this.payImgUrl,
      isPayed: this.isPayed,
      isAttended: this.isAttended,
      customer: this.customer ? this.customer.toJSON() : undefined,
      restaurant: this.restaurant ? this.restaurant.toJSON() : undefined,
    };
  }
}
