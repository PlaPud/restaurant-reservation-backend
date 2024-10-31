import { UserUseCases } from "../../application/User.UseCases";
import { GetUserRoleController } from "./auth/GetUserRoleController";

export class UserControllers {
  public readonly getRole: GetUserRoleController;

  public constructor(private readonly _useCases: UserUseCases) {
    this.getRole = new GetUserRoleController(this._useCases.getRole);
  }
}
