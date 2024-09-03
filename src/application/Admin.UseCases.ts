import { IAdminRepository } from "../infrastructure/interfaces/IAdminRepository";
import { LoginAdminUseCase } from "./authentication/LoginAdminUseCase";

export class AdminUseCases {
  public readonly login: LoginAdminUseCase;

  public constructor(private readonly _repository: IAdminRepository) {
    this.login = new LoginAdminUseCase(_repository);
  }
}
