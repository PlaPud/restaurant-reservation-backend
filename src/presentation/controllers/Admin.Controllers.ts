import { AdminUseCases } from "../../application/Admin.UseCases";
import { LoginAdminController } from "./authentication/LoginAdminController";

export class AdminControllers {
  public readonly login: LoginAdminController;

  constructor(private readonly _useCases: AdminUseCases) {
    this.login = new LoginAdminController(_useCases.login);
  }
}
