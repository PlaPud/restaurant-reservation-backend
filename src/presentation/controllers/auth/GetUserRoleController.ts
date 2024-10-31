import { Request, Response } from "express";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import {
  GetUserRoleUseCase,
  IGetUserRoleDto,
  IGetUserRoleResult,
} from "../../../application/authentication/GetUserRoleUseCase";
import { TOKEN_NAME } from "../../../shared/constants";
import { InternalServerError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface GetUserRoleResponseDto extends IGetUserRoleResult {}

export class GetUserRoleController {
  public constructor(private readonly _useCase: GetUserRoleUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const userInput: IGetUserRoleDto = {
        token: req.cookies[TOKEN_NAME],
      };

      const result = await this._useCase.execute(userInput);

      if (!result) throw new InternalServerError();

      const response: GetUserRoleResponseDto = {
        role: result.role,
      };

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
