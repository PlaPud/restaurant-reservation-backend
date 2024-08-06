import { GetAllCustomerController } from "../presentation/controllers/customer/GetAllCustomerController";
import { ICustomerRepository } from "../infrastructure/interfaces/ICustomerRepository";
import { CreateCustomerUseCase } from "./customer/CreateCustomerUseCase";
import { DeleteAllCustomerUseCase } from "./customer/DeleteAllCustomerUseCase";
import { DeleteCustomerUseCase } from "./customer/DeleteCustomerUseCase";
import { GetAllCustomerUseCase } from "./customer/GetAllCustomerUseCase";
import { GetCustomerUseCase } from "./customer/GetCustomerUseCase";
import { UpdateCustomerUseCase } from "./customer/UpdateCustomerUseCase";

export class CustomerUseCases {
  public readonly get: GetCustomerUseCase;
  public readonly getAll: GetAllCustomerUseCase;
  public readonly create: CreateCustomerUseCase;
  public readonly update: UpdateCustomerUseCase;
  public readonly delete: DeleteCustomerUseCase;
  public readonly deleteAll: DeleteAllCustomerUseCase;

  public constructor(private readonly _repository: ICustomerRepository) {
    this.get = new GetCustomerUseCase(_repository);
    this.getAll = new GetAllCustomerUseCase(_repository);
    this.create = new CreateCustomerUseCase(_repository);
    this.update = new UpdateCustomerUseCase(_repository);
    this.delete = new DeleteCustomerUseCase(_repository);
    this.deleteAll = new DeleteAllCustomerUseCase(_repository);
  }
}
