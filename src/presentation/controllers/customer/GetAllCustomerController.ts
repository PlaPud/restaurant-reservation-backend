import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import {
  GetAllCustomerUseCase,
  IGetAllCustomerResult,
} from "../../../application/customer/GetAllCustomerUseCase";
import { CustomerJSON } from "../../../domain/Customer";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export class GetAllCustomerDto implements IGetAllCustomerResult {
  constructor(public readonly data: CustomerJSON[]) {}
}

export class GetAllCustomerController {
  public constructor(private readonly _useCase: GetAllCustomerUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      const result = await this._useCase.execute();
      const response: GetAllCustomerDto = new GetAllCustomerDto(result.data);

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
