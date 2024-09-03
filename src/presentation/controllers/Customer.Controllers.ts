import { CustomerUseCases } from "../../application/Customer.UseCases";
import { LoginCustomerController } from "./authentication/LoginCustomerController";
import { CreateCustomerController } from "./customer/CreateCustomerController";
import { DeleteAllCustomerController } from "./customer/DeleteAllCustomerController";
import { DeleteCustomerController } from "./customer/DeleteCustomerController";
import { GetAllCustomerController } from "./customer/GetAllCustomerController";
import { GetCustomerController } from "./customer/GetCustomerController";
import { UpdateCustomerController } from "./customer/UpdateCustomerController";

export class CustomerControllers {
  public readonly get: GetCustomerController;
  public readonly getAll: GetAllCustomerController;
  public readonly create: CreateCustomerController;
  public readonly update: UpdateCustomerController;
  public readonly delete: DeleteCustomerController;
  public readonly deleteAll: DeleteAllCustomerController;

  public readonly login: LoginCustomerController;

  public constructor(private readonly _useCases: CustomerUseCases) {
    this.get = new GetCustomerController(_useCases.get);
    this.getAll = new GetAllCustomerController(_useCases.getAll);
    this.create = new CreateCustomerController(_useCases.create);
    this.update = new UpdateCustomerController(_useCases.update);
    this.delete = new DeleteCustomerController(_useCases.delete);
    this.deleteAll = new DeleteAllCustomerController(_useCases.deleteAll);
    this.login = new LoginCustomerController(_useCases.login);
  }
}
