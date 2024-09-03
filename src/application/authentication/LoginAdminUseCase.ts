import { InternalServerError } from "../../errors/HttpError";
import { IAdminRepository } from "../../infrastructure/interfaces/IAdminRepository";
import { JwtService } from "../../services/JwtService";
import { TokenRole } from "../../shared/enum/TokenRole";
import { IUseCase } from "../../shared/IUseCase";

export interface ILoginAdminDto {
  adminId: string;
  password: string | Buffer;
}

export interface ILoginAdminResult {
  adminId: string;
  token: string;
}

export class LoginAdminUseCase
  implements IUseCase<ILoginAdminDto, ILoginAdminResult>
{
  private readonly _jwtService = new JwtService();

  public constructor(private readonly _repository: IAdminRepository) {}

  public async execute(input: ILoginAdminDto): Promise<ILoginAdminResult> {
    const { adminId, password } = input;

    const target = await this._repository.find(adminId);

    if (!target) throw new InternalServerError();

    const token = await this._jwtService.getToken({
      payload: {
        sub: adminId,
        iat: Math.floor(Date.now() / 1000),
        role: TokenRole.ADMIN,
      },
      verifyData: {
        password,
        hashPassword: target.hashPassword,
      },
    });

    input.password = "";

    const body: ILoginAdminResult = {
      adminId,
      token,
    };

    return body;
  }
}
