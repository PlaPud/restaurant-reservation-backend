import { IUserRepository } from "../infrastructure/interfaces/IUserRepository";
import { GetUserRoleUseCase } from "./authentication/GetUserRoleUseCase";

export class UserUseCases {
  public readonly getRole: GetUserRoleUseCase;

  public constructor() {
    this.getRole = new GetUserRoleUseCase();
  }
}
