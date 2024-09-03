import { InternalServerError } from "../../errors/HttpError";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { JwtService } from "../../services/JwtService";
import { TokenRole } from "../../shared/enum/TokenRole";
import { IUseCase } from "../../shared/IUseCase";

export interface ILoginCustomerDto {
  email: string;
  password: string | Buffer;
}

export interface ILoginCustomerResult {
  customerId: string;
  token: string;
}

export class LoginCustomerUseCase
  implements IUseCase<ILoginCustomerDto, ILoginCustomerResult>
{
  private readonly _jwtService: JwtService;

  public constructor(private readonly _repository: ICustomerRepository) {
    this._jwtService = new JwtService();
  }

  public async execute(
    input: ILoginCustomerDto
  ): Promise<ILoginCustomerResult> {
    const { email, password } = input;

    const target = await this._repository.findByEmail(email);

    if (!target) throw new InternalServerError();

    const token = await this._jwtService.getToken({
      payload: {
        sub: target.customerId,
        iat: Math.floor(Date.now() / 1000),
        role: TokenRole.CUSTOMER,
      },
      verifyData: {
        password,
        hashPassword: target.hashPassword,
      },
    });

    input.password = "";

    const body: ILoginCustomerResult = {
      customerId: target.customerId,
      token,
    };

    return body;
  }
}
