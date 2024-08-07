import { Request, Response } from "express";
import { DeleteAllCustomerUseCase } from "../../../application/customer/DeleteAllCustomerUseCase";
import { IDeleteCustomerResult } from "../../../application/customer/DeleteCustomerUseCase";
import { STATUS_CODES } from "http";
import { StatusCode } from "../../../shared/enum/StatusCode";
import {
  BusinessRuleViolationError,
  UseCaseError,
} from "../../../errors/UseCaseError";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

class DeleteAllCustomerDto implements IDeleteCustomerResult {
  public constructor(public readonly deletionComplete: boolean) {}
}

export class DeleteAllCustomerController {
  public constructor(private readonly _useCase: DeleteAllCustomerUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      const result = await this._useCase.execute();
      const response: DeleteAllCustomerDto = new DeleteAllCustomerDto(
        result.deletionComplete
      );
      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
