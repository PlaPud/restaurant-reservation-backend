import { randomUUID } from "crypto";
import { Reservation, ReservationJSON } from "./Reservation";

export interface RestaurantJSON {
  restaurantId: string;
  name: string;
  currentReserves: ReservationJSON[];
  phone: string;
  address: string;
}

export class Restaurant {
  public constructor(
    public readonly restaurantId: string = randomUUID(),
    public readonly name: string,
    public readonly currentReserves: Reservation[] = [],
    public readonly phone: string,
    public readonly address: string
  ) {}

  public static fromJSON(jsonObj: RestaurantJSON): Restaurant {
    return new Restaurant(
      jsonObj.restaurantId,
      jsonObj.name,
      jsonObj.currentReserves.map((rsObj) => Reservation.fromJSON(rsObj)),
      jsonObj.phone,
      jsonObj.address
    );
  }

  public toJSON(): RestaurantJSON {
    return {
      restaurantId: this.restaurantId,
      name: this.name,
      currentReserves: this.currentReserves.map((rs) => rs.toJSON()),
      phone: this.phone,
      address: this.address,
    };
  }
}
