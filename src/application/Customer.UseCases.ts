import { ICustomerRepository } from "../infrastructure/interfaces/ICustomerRepository";
import { IImageRepository } from "../infrastructure/interfaces/IImageRepository";
import { LoginCustomerUseCase } from "./authentication/LoginCustomerUseCase";
import { CreateCustomerUseCase } from "./customer/CreateCustomerUseCase";
import { DeleteAllCustomerUseCase } from "./customer/DeleteAllCustomerUseCase";
import { DeleteCustomerProfImgUseCase } from "./customer/DeleteCustomerProfileImgUseCase";
import { DeleteCustomerUseCase } from "./customer/DeleteCustomerUseCase";
import { GetManyCustomerUseCase } from "./customer/GetManyCustomerUseCase";
import { GetCustomerUseCase } from "./customer/GetCustomerUseCase";
import { UpdateCustomerProfileImgUseCase } from "./customer/UpdateCustomerProfileImgUseCase";
import { UpdateCustomerUseCase } from "./customer/UpdateCustomerUseCase";

export class CustomerUseCases {
  public readonly get: GetCustomerUseCase;
  public readonly getAll: GetManyCustomerUseCase;
  public readonly create: CreateCustomerUseCase;
  public readonly update: UpdateCustomerUseCase;
  public readonly updateProfImg: UpdateCustomerProfileImgUseCase;
  public readonly delete: DeleteCustomerUseCase;
  public readonly deleteAll: DeleteAllCustomerUseCase;
  public readonly deleteProfImg: DeleteCustomerProfImgUseCase;

  public readonly login: LoginCustomerUseCase;

  public constructor(
    private readonly _repository: ICustomerRepository,
    private readonly _imgRepo: IImageRepository
  ) {
    this.get = new GetCustomerUseCase(_repository);
    this.getAll = new GetManyCustomerUseCase(_repository);
    this.create = new CreateCustomerUseCase(_repository);
    this.update = new UpdateCustomerUseCase(_repository);
    this.delete = new DeleteCustomerUseCase(_repository);
    this.deleteAll = new DeleteAllCustomerUseCase(_repository);
    this.login = new LoginCustomerUseCase(_repository);
    this.updateProfImg = new UpdateCustomerProfileImgUseCase(
      _repository,
      _imgRepo
    );
    this.deleteProfImg = new DeleteCustomerProfImgUseCase(
      _repository,
      _imgRepo
    );
  }
}
