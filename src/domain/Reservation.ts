import { Customer } from "./Customer";
import { Restaurant } from "./Restaurant";

export class Reservation {
  public constructor(
    public readonly reserveId: string,
    public readonly date: string = Date.now().toString(),
    public readonly reserveDate: string,
    public readonly payImgUrl: string,
    public readonly isPayed: boolean = false,
    public readonly isAttended: boolean = false,
    public readonly customer: Customer,
    public readonly restaurant: Restaurant
  ) { }
}