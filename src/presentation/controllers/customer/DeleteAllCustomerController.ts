import { Request, Response } from "express";
import { DeleteAllCustomerUseCase } from "../../../application/customer/DeleteAllCustomerUseCase";
import { IDeleteCustomerResult } from "../../../application/customer/DeleteCustomerUseCase";
import { STATUS_CODES } from "http";
import { StatusCode } from "../../../shared/enum/StatusCode";
import {
  BusinessRuleViolationError,
  UnauthorizedActionError,
  UseCaseError,
} from "../../../errors/UseCaseError";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { TOKEN_NAME } from "../../../shared/constants";
import { IVerifyRoleResult, JwtService } from "../../../services/JwtService";
import { TokenRole } from "../../../shared/enum/TokenRole";
import { isRequestFromOwner } from "../../../shared/utilsFunc";

class DeleteAllCustomerResponseDto implements IDeleteCustomerResult {
  public constructor(public readonly deletionComplete: boolean) {}
}

export class DeleteAllCustomerController {
  private readonly _jwtService: JwtService;

  public constructor(private readonly _useCase: DeleteAllCustomerUseCase) {
    this._jwtService = new JwtService();
  }

  public async handle(req: Request, res: Response) {
    try {
      if (!req.cookies[TOKEN_NAME]) throw new UnauthorizedActionError();

      const verifyResult: IVerifyRoleResult =
        await this._jwtService.verifyTokenRole({
          token: req.cookies[TOKEN_NAME],
          toHaveRole: [TokenRole.ADMIN],
        });

      if (!verifyResult.isAuthorized)
        throw new UnauthorizedActionError(`Must be requested by admin.`);

      const result = await this._useCase.execute();
      const response: DeleteAllCustomerResponseDto =
        new DeleteAllCustomerResponseDto(result.deletionComplete);
      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
