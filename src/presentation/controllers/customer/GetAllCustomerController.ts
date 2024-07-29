import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import {
  GetAllCustomerUseCase,
  IGetAllCustomerResult,
} from "../../../application/customer/GetAllCustomerUseCase";
import { CustomerJSON } from "../../../domain/Customer";
import { handleControllerError } from "../../../shared/HandleControllerError";

export class GetAllCustomerDto implements IGetAllCustomerResult {
  constructor(public readonly data: CustomerJSON[]) {}
}

export class GetAllCustomerController {
  public constructor(private readonly _useCase: GetAllCustomerUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      const result = await this._useCase.execute();
      const response: GetAllCustomerDto = new GetAllCustomerDto(result.data);

      res.status(200).json(response);
    } catch (err) {
      handleControllerError(res, err);
    }
  }
}
