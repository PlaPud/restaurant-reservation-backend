import { Restaurant } from "../../domain/Restaurant";
import { IFilterRestaurant } from "../../shared/searchFilter";

export interface IRestaurantRepository {
  find(id: string): Promise<Restaurant | null>;

  findByEmail(email: string): Promise<Restaurant | null>;

  findMany(
    page: number,
    filterBy: IFilterRestaurant | null
  ): Promise<Restaurant[] | null>;

  save(restaurant: Restaurant): Promise<Restaurant | null>;

  update(id: string, data: Restaurant): Promise<Restaurant | null>;

  updateProfileImgPath(id: string, imgPath: string): Promise<Restaurant | null>;

  delete(id: string): Promise<boolean>;

  deleteAll(): Promise<boolean>;
}
