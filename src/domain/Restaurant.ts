import { randomUUID } from "crypto";
import { Reservation, ReservationJSON } from "./Reservation";

export interface RestaurantJSON {
  restaurantId: string;
  name: string;
  phone: string;
  address: string;
  currentReserves: ReservationJSON[];
}

export type RestaurantConstrParams = {
  restaurantId?: string;
  name: string;
  phone: string;
  address: string;
  currentReserves?: Reservation[];
};

export class Restaurant {
  public readonly restaurantId: string = randomUUID();
  public readonly name: string;
  public readonly phone: string;
  public readonly address: string;
  public readonly currentReserves: Reservation[];

  public constructor(private readonly _options: RestaurantConstrParams) {
    this.restaurantId = this._options.restaurantId ?? randomUUID();
    this.name = this._options.name ?? "";
    this.phone = this._options.phone ?? "";
    this.address = this._options.address ?? "";
    this.currentReserves = this._options.currentReserves ?? [];
  }

  public static fromJSON(jsonObj: RestaurantJSON): Restaurant {
    return new Restaurant({
      restaurantId: jsonObj.restaurantId,
      name: jsonObj.name,
      phone: jsonObj.phone,
      address: jsonObj.address,
      currentReserves: jsonObj.currentReserves?.map((rsObj) =>
        Reservation.fromJSON(rsObj)
      ),
    });
  }

  public toJSON(): RestaurantJSON {
    return {
      restaurantId: this.restaurantId,
      name: this.name,
      phone: this.phone,
      address: this.address,
      currentReserves: this.currentReserves.map((rs) => rs.toJSON()),
    };
  }
}
