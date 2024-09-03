import { InternalServerError } from "../../errors/HttpError";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { JwtService } from "../../services/JwtService";
import { TokenRole } from "../../shared/enum/TokenRole";
import { IUseCase } from "../../shared/IUseCase";

export interface ILoginRestaurantDto {
  email: string;
  password: string;
}

export interface ILoginRestaurantResult {
  restaurantId: string;
  token: string;
}

export class LoginRestaurantUseCase
  implements IUseCase<ILoginRestaurantDto, ILoginRestaurantResult>
{
  private readonly _jwtService: JwtService;

  public constructor(private readonly _repository: IRestaurantRepository) {
    this._jwtService = new JwtService();
  }

  public async execute(
    input: ILoginRestaurantDto
  ): Promise<ILoginRestaurantResult> {
    const { email, password } = input;

    const target = await this._repository.findByEmail(email);

    if (!target) throw new InternalServerError();

    const token = await this._jwtService.getToken({
      payload: {
        sub: target.restaurantId,
        iat: Math.floor(Date.now() / 1000),
        role: TokenRole.RESTAURANT,
      },
      verifyData: {
        password,
        hashPassword: target.hashPassword,
      },
    });

    input.password = "";

    const body: ILoginRestaurantResult = {
      restaurantId: target.restaurantId,
      token: token,
    };

    return body;
  }
}
