import { randomUUID } from "crypto";
import { Reservation } from "./Reservation";

export class Restaurant {
  public constructor(
    public readonly restaurantId: string = randomUUID(),
    public readonly name: string,
    public readonly currentReserves: Reservation[],
    public readonly reserves: Number,
    public readonly phone: string,
    public readonly address: string
  ) { }
}