import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import { GetCustomerUseCase } from "../../../application/customer/GetCustomerUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { handleControllerError } from "../../../shared/HandleControllerError";
import { NotFoundError } from "../../../errors/HttpError";
import { UseCaseError } from "../../../errors/UseCaseError";

export class GetCustomerController {
  public constructor(private readonly _useCase: GetCustomerUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const userInput = {
        customerId: req.query.customerId as string,
      };

      const result = await this._useCase.execute(userInput);
      res.status(StatusCode.SUCCESS).json(result);
    } catch (err) {
      handleControllerError(res, err);
    }
  }
}
