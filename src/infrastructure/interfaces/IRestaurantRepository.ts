import { Restaurant } from "../../domain/Restaurant";

export interface IRestaurantRepository {
  find(id: string): Promise<Restaurant | null>;

  findByEmail(email: string): Promise<Restaurant | null>;

  findAll(): Promise<Restaurant[] | null>;

  save(restaurant: Restaurant): Promise<Restaurant | null>;

  update(id: string, data: Restaurant): Promise<Restaurant | null>;

  delete(id: string): Promise<boolean>;

  deleteAll(): Promise<boolean>;
}
