import { Request, Response } from "express";
import {
  ILoginCustomerDto,
  ILoginCustomerResult,
  LoginCustomerUseCase,
} from "../../../application/authentication/LoginCustomerUseCase";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";
import ms from "ms";
import { LOGGED_IN, TOKEN_NAME } from "../../../shared/constants";
import { UnauthorizedActionError } from "../../../errors/UseCaseError";

export interface LoggedInCustomerResponseDto {
  customerId: string;
  status: string;
  loginDate: string;
}

export class LoginCustomerController {
  private readonly _expMs: number;

  public constructor(private readonly _useCase: LoginCustomerUseCase) {
    this._expMs = ms(String(process.env.JWT_EXP_TIME));
  }

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body || !req.body.email || !req.body.password)
        throw new BadRequestError();

      if (req.cookies[TOKEN_NAME])
        throw new UnauthorizedActionError(`Must logout first.`);

      const userInput: ILoginCustomerDto = {
        email: req.body.email,
        password: req.body.password,
      };

      const result = await this._useCase.execute(userInput);

      if (req.header("set-cookie")) res.clearCookie(TOKEN_NAME);

      const response: LoggedInCustomerResponseDto = {
        customerId: result.customerId,
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
      sendErrorResponse(res, err);
    }
  }
}
