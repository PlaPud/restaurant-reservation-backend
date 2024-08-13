import { randomUUID } from "crypto";
import { Reservation, ReservationJSON } from "./Reservation";

export interface RestaurantJSON {
  restaurantId: string;
  name: string;
  phone: string;
  address: string;
  currentReserves: ReservationJSON[];
}

export class Restaurant {
  public constructor(
    public readonly restaurantId: string = randomUUID(),
    public readonly name: string,
    public readonly phone: string,
    public readonly address: string,
    public readonly currentReserves: Reservation[] = []
  ) {}

  public static fromJSON(jsonObj: RestaurantJSON): Restaurant {
    return new Restaurant(
      jsonObj.restaurantId,
      jsonObj.name,
      jsonObj.phone,
      jsonObj.address,
      jsonObj.currentReserves?.map((rsObj) => Reservation.fromJSON(rsObj))
    );
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
