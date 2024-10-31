import { IImageRepository } from "../infrastructure/interfaces/IImageRepository";
import { IRestaurantRepository } from "../infrastructure/interfaces/IRestaurantRepository";
import { LoginRestaurantUseCase } from "./authentication/LoginRestaurantUseCase";
import { CreateRestaurantUseCase } from "./restaurant/CreateRestaurantUseCase";
import { DeleteAllRestaurantUseCase } from "./restaurant/DeleteAllRestaurantUseCase";
import { DeleteRestaurantProfileImgUseCase } from "./restaurant/DeleteRestaurantProfileImgUseCase";
import { DeleteRestaurantUseCase } from "./restaurant/DeleteRestaurantUseCase";
import { GetManyRestaurantUseCase } from "./restaurant/GetManyRestaurantUseCase";
import { GetRestaurantUseCase } from "./restaurant/GetRestaurantUseCase";
import { UpdateRestaurantProfileImgUseCase } from "./restaurant/UpdateRestaurantProfileImgUseCase";
import { UpdateRestaurantUseCase } from "./restaurant/UpdateRestaurantUseCase";

export class RestaurantUseCases {
  public readonly get: GetRestaurantUseCase;
  public readonly getAll: GetManyRestaurantUseCase;
  public readonly create: CreateRestaurantUseCase;
  public readonly update: UpdateRestaurantUseCase;
  public readonly updateProfImg: UpdateRestaurantProfileImgUseCase;
  public readonly delete: DeleteRestaurantUseCase;
  public readonly deleteAll: DeleteAllRestaurantUseCase;
  public readonly deleteProfImg: DeleteRestaurantProfileImgUseCase;

  public readonly login: LoginRestaurantUseCase;

  public constructor(
    private readonly _repository: IRestaurantRepository,
    private readonly _imgRepo: IImageRepository
  ) {
    this.get = new GetRestaurantUseCase(_repository);
    this.getAll = new GetManyRestaurantUseCase(_repository);
    this.create = new CreateRestaurantUseCase(_repository);
    this.update = new UpdateRestaurantUseCase(_repository);
    this.delete = new DeleteRestaurantUseCase(_repository);
    this.deleteAll = new DeleteAllRestaurantUseCase(_repository);
    this.updateProfImg = new UpdateRestaurantProfileImgUseCase(
      _repository,
      _imgRepo
    );
    this.deleteProfImg = new DeleteRestaurantProfileImgUseCase(
      _repository,
      _imgRepo
    );

    this.login = new LoginRestaurantUseCase(_repository);
  }
}
