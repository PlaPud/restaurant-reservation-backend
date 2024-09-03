import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import { GetCustomerUseCase } from "../../../application/customer/GetCustomerUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { BadRequestError, NotFoundError } from "../../../errors/HttpError";
import {
  UnauthorizedActionError,
  UseCaseError,
} from "../../../errors/UseCaseError";
import { CustomerJSONResponse } from "../../../domain/Customer";
import { TOKEN_NAME } from "../../../shared/constants";

export interface GetCustomerResponseDto extends CustomerJSONResponse {}

export class GetCustomerController {
  public constructor(private readonly _useCase: GetCustomerUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      // if (!req.cookies[TOKEN_NAME]) throw new UnauthorizedActionError();

      if (!req.query.customerId) throw new BadRequestError();

      const userInput = {
        customerId: req.query.customerId as string,
      };

      if (!req.cookies[TOKEN_NAME]) throw new UnauthorizedActionError();

      const result = await this._useCase.execute(userInput);

      const response: GetCustomerResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
