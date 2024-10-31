import { Request, Response } from "express";
import {
  ILoginRestaurantDto,
  ILoginRestaurantResult,
  LoginRestaurantUseCase,
} from "../../../application/authentication/LoginRestaurantUseCase";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { BadRequestError } from "../../../errors/HttpError";
import {
  LOGGED_IN,
  SET_COOKIE_HEADER,
  TOKEN_NAME,
} from "../../../shared/constants";
import ms from "ms";
import { UnauthorizedActionError } from "../../../errors/UseCaseError";

export interface LoggedInRestaurantResponseDto {
  restaurantId: string;
  status: string;
  loginDate: string;
}

export class LoginRestaurantController {
  private readonly _expMs: number;

  public constructor(private readonly _useCase: LoginRestaurantUseCase) {
    this._expMs = ms(String(process.env.JWT_EXP_TIME));
  }

  public async handle(req: Request, res: Response) {
    try {
      if (!req.body || !req.body.email || !req.body.password)
        throw new BadRequestError();

      if (req.cookies[TOKEN_NAME])
        throw new UnauthorizedActionError(`Must logout first.`);

      const { email, password } = req.body;

      const userInput: ILoginRestaurantDto = {
        email,
        password,
      };

      const result = await this._useCase.execute(userInput);

      if (req.header(SET_COOKIE_HEADER)) res.clearCookie(TOKEN_NAME);

      const response: LoggedInRestaurantResponseDto = {
        restaurantId: result.restaurantId,
        status: LOGGED_IN,
        loginDate: new Date().toISOString(),
      };

      res.cookie(TOKEN_NAME, result.token, {
        httpOnly: true,
        secure: true,
        maxAge: this._expMs,
      });

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
