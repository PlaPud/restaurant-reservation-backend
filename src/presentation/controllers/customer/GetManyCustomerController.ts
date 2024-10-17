import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import {
  GetManyCustomerUseCase,
  IGetManyCustomerResult,
} from "../../../application/customer/GetManyCustomerUseCase";
import { CustomerObj, CustomerJSONResponse } from "../../../domain/Customer";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { TOKEN_NAME } from "../../../shared/constants";
import { UnauthorizedActionError } from "../../../errors/UseCaseError";

export interface GetManyCustomerResponseDto extends IGetManyCustomerResult {}

export class GetManyCustomerController {
  public constructor(private readonly _useCase: GetManyCustomerUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      if (!req.cookies[TOKEN_NAME]) throw new UnauthorizedActionError();

      this._useCase.setPagination(req.body.page ? Number(req.body.page) : 1);

      const result = await this._useCase.execute();

      const response: GetManyCustomerResponseDto = {
        page: result.page,
        data: result.data,
      };

      if (response.data.length <= 0) {
        res.sendStatus(StatusCode.NO_CONTENT);
        return;
      }

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
