import { Restaurant } from "../../domain/Restaurant";

export interface IRestaurantRepository {
  find(): Promise<Restaurant | null>;

  findAll(): Promise<Restaurant[]>;

  save(restaurant: Restaurant): Promise<Restaurant | null>;

  update(id: string, data: Restaurant): Promise<boolean>;

  delete(id: string): Promise<boolean>;

  deleteAll(): Promise<boolean>;
}
