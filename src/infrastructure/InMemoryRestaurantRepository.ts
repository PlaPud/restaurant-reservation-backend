import { IRestaurantRepository } from "./interfaces/IRestaurantRepository";
import { Restaurant } from "../domain/Restaurant";
import { DataIntegrityError, RepositoryError } from "../errors/RepositoryError";
import { EntityNotFoundError } from "../errors/DomainError";
import { IFilterRestaurant } from "../shared/searchFilter";

export class InMemoryRestaurantRepository implements IRestaurantRepository {
  private readonly _restaurants: Restaurant[] = [];

  public constructor() {}
  getRecordsCount(
    page: number,
    searchQuery: string,
    filterBy: IFilterRestaurant | null
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }

  public async updateProfileImgPath(
    id: string,
    imgPath: string
  ): Promise<Restaurant | null> {
    throw new Error("Method not implemented.");
  }

  public async find(id: string): Promise<Restaurant | null> {
    const result = this._restaurants.find((rs) => rs.restaurantId === id);

    if (!result)
      throw new EntityNotFoundError(`Cannot Find Restaurant (ID: ${id})`);

    return result;
  }

  public async findByEmail(email: string): Promise<Restaurant | null> {
    const result = this._restaurants.find((rs) => rs.email === email);

    if (!result)
      throw new EntityNotFoundError(`Cannot Find Restaurant (Email: ${email})`);

    return result;
  }

  public async findMany(): Promise<Restaurant[]> {
    const result = this._restaurants ?? null;

    if (!result) throw new DataIntegrityError();

    return result;
  }
  public async save(restaurant: Restaurant): Promise<Restaurant | null> {
    try {
      this._restaurants.push(restaurant);
      return restaurant;
    } catch (e) {
      throw new RepositoryError("Repository Error.");
    }
  }
  public async update(id: string, data: Restaurant): Promise<Restaurant> {
    const idx = this._restaurants.findIndex((rs) => rs.restaurantId === id);

    if (!indexFound(idx))
      throw new EntityNotFoundError(`Cannot Find Customer (ID: ${id})`);

    try {
      this._restaurants[idx] = new Restaurant({
        restaurantId: this._restaurants[idx].restaurantId,
        name: data.name,
        phone: data.phone,
        address: data.address,
        subDistrict: data.subDistrict,
        district: data.district,
        province: data.province,
        email: data.email,
        reservation: data.reservation,
        hashPassword: data.hashPassword,
      });

      return this._restaurants[idx];
    } catch (err) {
      throw new RepositoryError("Repository Error");
    }
  }
  public async delete(id: string): Promise<boolean> {
    const idx = this._restaurants.findIndex((rs) => rs.restaurantId === id);

    if (!indexFound(idx))
      throw new EntityNotFoundError(`Cannot Find Customer (ID: ${id})`);

    this._restaurants.splice(idx, 1);

    return true;
  }
  public async deleteAll(): Promise<boolean> {
    try {
      this._restaurants.splice(0, this._restaurants.length);
      return true;
    } catch (err) {
      throw new RepositoryError("Repository Error");
    }
  }
}

const indexFound = (idx: number) => idx > -1;
