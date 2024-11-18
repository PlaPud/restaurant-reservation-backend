import { UserUseCases } from "../../application/User.UseCases";
import { GetUserDataController } from "./auth/GetUserRoleController";

export class UserControllers {
  public readonly getData: GetUserDataController;

  public constructor(private readonly _useCases: UserUseCases) {
    this.getData = new GetUserDataController(this._useCases.getRole);
  }
}
