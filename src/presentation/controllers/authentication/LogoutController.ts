import { Request, Response } from "express";
import { TOKEN_NAME } from "../../../shared/constants";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { UnauthorizedActionError } from "../../../errors/UseCaseError";

export interface LoggedOutResponseDto {
  msg: string;
}

export class LogoutController {
  public constructor() {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.cookies[TOKEN_NAME]) {
        throw new UnauthorizedActionError(
          `Already logged out. No token found.`
        );
      }

      const response: LoggedOutResponseDto = {
        msg: "Logged out successfully!",
      };

      res.clearCookie(TOKEN_NAME);
      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
