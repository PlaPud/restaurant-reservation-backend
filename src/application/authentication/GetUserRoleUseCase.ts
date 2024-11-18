import { User, UserJSONResponse } from "../../domain/User";
import { IUserRepository } from "../../infrastructure/interfaces/IUserRepository";
import { JwtService } from "../../services/JwtService";
import { TokenRole } from "../../shared/enum/TokenRole";
import { IUseCase } from "../../shared/IUseCase";

export interface IGetUserRoleDto {
  token?: string;
}

export interface IGetUserRoleResult {
  role: TokenRole | null;
  id: string | null;
}

export class GetUserRoleUseCase
  implements IUseCase<IGetUserRoleDto, IGetUserRoleResult>
{
  private readonly _jwtService = new JwtService();

  public constructor() {}

  public async execute(input: IGetUserRoleDto): Promise<IGetUserRoleResult> {
    let role: TokenRole | null = null;
    let id: string | null = null;

    if (input.token) {
      const payload = await this._jwtService.verifyToken(input.token);
      role = payload.role;
      id = payload.sub ?? null;
    }

    const result = new User({ role, id });

    const body: IGetUserRoleResult = {
      role: result.toJSONResponse().role,
      id: result.toJSONResponse().id,
    };

    return body;
  }
}
