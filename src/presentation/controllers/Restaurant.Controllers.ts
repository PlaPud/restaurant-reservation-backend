import { RestaurantUseCases } from "../../application/Restaurant.UseCases";
import { LoginRestaurantController } from "./authentication/LoginRestaurantController";
import { CreateRestaurantController } from "./restaurant/CreateRestaurantController";
import { DeleteAllRestaurantController } from "./restaurant/DeleteAllRestaurantController";
import { DeleteRestaurantController } from "./restaurant/DeleteRestaurantController";
import { DeleteRestaurantProfileImgController } from "./restaurant/DeleteRestaurantProfileImgController";
import { GetManyRestaurantController } from "./restaurant/GetManyRestaurantController";
import { GetRestaurantController } from "./restaurant/GetRestaurantController";
import { UpdateRestaurantController } from "./restaurant/UpdateRestaurantController";
import { UpdateRestaurantProfileImgController } from "./restaurant/UpdateRestaurantProfileImgController";

export class RestaurantControllers {
  public readonly get: GetRestaurantController;
  public readonly getAll: GetManyRestaurantController;
  public readonly create: CreateRestaurantController;
  public readonly update: UpdateRestaurantController;
  public readonly updateProfImg: UpdateRestaurantProfileImgController;
  public readonly delete: DeleteRestaurantController;
  public readonly deleteAll: DeleteAllRestaurantController;
  public readonly deleteProfImg: DeleteRestaurantProfileImgController;

  public readonly login: LoginRestaurantController;

  constructor(private readonly _useCases: RestaurantUseCases) {
    this.get = new GetRestaurantController(_useCases.get);
    this.getAll = new GetManyRestaurantController(_useCases.getAll);
    this.create = new CreateRestaurantController(_useCases.create);
    this.update = new UpdateRestaurantController(_useCases.update);
    this.delete = new DeleteRestaurantController(_useCases.delete);
    this.deleteAll = new DeleteAllRestaurantController(_useCases.deleteAll);

    this.login = new LoginRestaurantController(_useCases.login);

    this.updateProfImg = new UpdateRestaurantProfileImgController(
      _useCases.updateProfImg
    );
    this.deleteProfImg = new DeleteRestaurantProfileImgController(
      _useCases.deleteProfImg
    );
  }
}
