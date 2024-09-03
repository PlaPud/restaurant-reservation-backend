import { IRestaurantRepository } from "../infrastructure/interfaces/IRestaurantRepository";
import { LoginRestaurantUseCase } from "./authentication/LoginRestaurantUseCase";
import { CreateRestaurantUseCase } from "./restaurant/CreateRestaurantUseCase";
import { DeleteAllRestaurantUseCase } from "./restaurant/DeleteAllRestaurantUseCase";
import { DeleteRestaurantUseCase } from "./restaurant/DeleteRestaurantUseCase";
import { GetAllRestaurantUseCase } from "./restaurant/GetAllRestaurantUseCase";
import { GetRestaurantUseCase } from "./restaurant/GetRestaurantUseCase";
import { UpdateRestaurantUseCase } from "./restaurant/UpdateRestaurantUseCase";

export class RestaurantUseCases {
  public readonly get: GetRestaurantUseCase;
  public readonly getAll: GetAllRestaurantUseCase;
  public readonly create: CreateRestaurantUseCase;
  public readonly update: UpdateRestaurantUseCase;
  public readonly delete: DeleteRestaurantUseCase;
  public readonly deleteAll: DeleteAllRestaurantUseCase;

  public readonly login: LoginRestaurantUseCase;

  public constructor(private readonly _repository: IRestaurantRepository) {
    this.get = new GetRestaurantUseCase(_repository);
    this.getAll = new GetAllRestaurantUseCase(_repository);
    this.create = new CreateRestaurantUseCase(_repository);
    this.update = new UpdateRestaurantUseCase(_repository);
    this.delete = new DeleteRestaurantUseCase(_repository);
    this.deleteAll = new DeleteAllRestaurantUseCase(_repository);

    this.login = new LoginRestaurantUseCase(_repository);
  }
}
