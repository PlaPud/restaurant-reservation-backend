import { Request, Response } from "express";
import {
  DeleteCustomerUseCase,
  IDeleteCustomerResult,
} from "../../../application/customer/DeleteCustomerUseCase";
import { STATUS_CODES } from "http";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { BadRequestError } from "../../../errors/HttpError";
import { TOKEN_NAME } from "../../../shared/constants";
import { UnauthorizedActionError } from "../../../errors/UseCaseError";
import { IVerifyRoleResult, JwtService } from "../../../services/JwtService";
import { TokenRole } from "../../../shared/enum/TokenRole";
import { isRequestFromOwner } from "../../../shared/utilsFunc";

export class DeletedCustomerDto implements IDeleteCustomerResult {
  public constructor(public readonly deletionComplete: boolean) {}
}

export class DeleteCustomerController {
  private readonly _jwtService: JwtService;

  public constructor(private readonly _useCase: DeleteCustomerUseCase) {
    this._jwtService = new JwtService();
  }

  public async handle(req: Request, res: Response) {
    try {
      if (!req.query.customerId) throw new BadRequestError();

      if (!req.cookies[TOKEN_NAME]) throw new UnauthorizedActionError();

      const verifyResult: IVerifyRoleResult =
        await this._jwtService.verifyTokenRole({
          token: req.cookies[TOKEN_NAME],
          toHaveRole: [TokenRole.ADMIN, TokenRole.CUSTOMER],
        });

      if (!verifyResult.isAuthorized) throw new UnauthorizedActionError();

      const userInput = { customerId: req.query.customerId as string };

      const result = await this._useCase.execute(userInput);

      const response: DeletedCustomerDto = new DeletedCustomerDto(
        result.deletionComplete
      );

      res.status(200).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
