import { GetManyRestaurantUseCase } from "../../application/restaurant/GetManyRestaurantUseCase";
import { UpdateRestaurantUseCase } from "../../application/restaurant/UpdateRestaurantUseCase";

export const RESTAURANT_T = {
  PrismaRestaurantRepository: Symbol.for("PrismaRestaurantRepository"),
  InMemoryRestaurantRepository: Symbol.for("InMemoryRestaurantRepository"),
  CreateRestaurantUseCase: Symbol.for("CreateRestaurantUseCase"),
  GetRestaurantUseCase: Symbol.for("GetRestaurantUseCase"),
  GetAllRestaurantUseCase: Symbol.for("GetAllRestaurantUseCase"),
  UpdateRestaurantUseCase: Symbol.for("UpdateRestaurantUseCase"),
  DeleteRestaurantUseCase: Symbol.for("DeleteRestaurantUseCase"),
  DeleteAllRestaurantUseCase: Symbol.for("DeleteAllRestaurantUseCase"),
};
