import { RestaurantUseCases } from "../../application/Restaurant.UseCases";
import { LoginRestaurantController } from "./authentication/LoginRestaurantController";
import { CreateRestaurantController } from "./restaurant/CreateRestaurantController";
import { DeleteAllRestaurantController } from "./restaurant/DeleteAllRestaurantController";
import { DeleteRestaurantController } from "./restaurant/DeleteRestaurantController";
import { GetAllRestaurantController } from "./restaurant/GetAllRestaurantController";
import { GetRestaurantController } from "./restaurant/GetRestaurantController";
import { UpdateRestaurantController } from "./restaurant/UpdateRestaurantController";

export class RestaurantControllers {
  public readonly get: GetRestaurantController;
  public readonly getAll: GetAllRestaurantController;
  public readonly create: CreateRestaurantController;
  public readonly update: UpdateRestaurantController;
  public readonly delete: DeleteRestaurantController;
  public readonly deleteAll: DeleteAllRestaurantController;

  public readonly login: LoginRestaurantController;

  constructor(private readonly _useCases: RestaurantUseCases) {
    this.get = new GetRestaurantController(_useCases.get);
    this.getAll = new GetAllRestaurantController(_useCases.getAll);
    this.create = new CreateRestaurantController(_useCases.create);
    this.update = new UpdateRestaurantController(_useCases.update);
    this.delete = new DeleteRestaurantController(_useCases.delete);
    this.deleteAll = new DeleteAllRestaurantController(_useCases.deleteAll);

    this.login = new LoginRestaurantController(_useCases.login);
  }
}
