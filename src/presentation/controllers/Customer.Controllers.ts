import { CustomerUseCases } from "../../application/Customer.UseCases";
import { LoginCustomerController } from "./auth/LoginCustomerController";
import { CreateCustomerController } from "./customer/CreateCustomerController";
import { DeleteAllCustomerController } from "./customer/DeleteAllCustomerController";
import { DeleteCustomerController } from "./customer/DeleteCustomerController";
import { DeleteCustomerProfImgController } from "./customer/DeleteCustomerProfImgController";
import { GetManyCustomerController } from "./customer/GetManyCustomerController";
import { GetCustomerController } from "./customer/GetCustomerController";
import { UpdateCustomerController } from "./customer/UpdateCustomerController";
import { UpdateCustomerProfImgController } from "./customer/UpdateCustomerProfImgController";

export class CustomerControllers {
  public readonly get: GetCustomerController;
  public readonly getAll: GetManyCustomerController;
  public readonly create: CreateCustomerController;
  public readonly update: UpdateCustomerController;
  public readonly delete: DeleteCustomerController;
  public readonly deleteAll: DeleteAllCustomerController;
  public readonly updateProfImg: UpdateCustomerProfImgController;
  public readonly deleteProfImg: DeleteCustomerProfImgController;

  public readonly login: LoginCustomerController;

  public constructor(private readonly _useCases: CustomerUseCases) {
    this.get = new GetCustomerController(_useCases.get);
    this.getAll = new GetManyCustomerController(_useCases.getAll);
    this.create = new CreateCustomerController(_useCases.create);
    this.update = new UpdateCustomerController(_useCases.update);
    this.delete = new DeleteCustomerController(_useCases.delete);
    this.deleteAll = new DeleteAllCustomerController(_useCases.deleteAll);
    this.login = new LoginCustomerController(_useCases.login);
    this.updateProfImg = new UpdateCustomerProfImgController(
      _useCases.updateProfImg
    );
    this.deleteProfImg = new DeleteCustomerProfImgController(
      _useCases.deleteProfImg
    );
  }
}
