import { Request, Response } from "express";
import {
  ILoginAdminDto,
  ILoginAdminResult,
  LoginAdminUseCase,
} from "../../../application/authentication/LoginAdminUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import ms from "ms";
import { LOGGED_IN, TOKEN_NAME } from "../../../shared/constants";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface LoggedInAdminResponseDto {
  adminId: string;
  status: string;
  loginDate: string;
}

export class LoginAdminController {
  private readonly _expMs: number;

  public constructor(private readonly _useCase: LoginAdminUseCase) {
    this._expMs = ms(String(process.env.JWT_EXP_TIME));
  }

  public async handle(req: Request, res: Response): Promise<void> {
    if (!req.body || !req.body.adminId || !req.body.password)
      throw new BadRequestError();

    const userInput: ILoginAdminDto = {
      adminId: req.body.adminId,
      password: req.body.password,
    };

    const result = await this._useCase.execute(userInput);

    if (req.header("set-cookie")) res.clearCookie(TOKEN_NAME);

    const response: LoggedInAdminResponseDto = {
      adminId: result.adminId,
      status: LOGGED_IN,
      loginDate: new Date().toISOString(),
    };

    res.cookie(TOKEN_NAME, result.token, {
      httpOnly: true,
      secure: true,
      maxAge: this._expMs,
    });

    res.status(StatusCode.OK).json(response);
  }
}
