import { Request, Response } from "express";
import {
  DeleteCustomerUseCase,
  IDeleteCustomerResult,
} from "../../../application/customer/DeleteCustomerUseCase";
import { STATUS_CODES } from "http";
import { handleControllerError } from "../../../shared/HandleControllerError";
import { BadRequestError } from "../../../errors/HttpError";

export class DeletedCustomerDto implements IDeleteCustomerResult {
  public constructor(public readonly deletionComplete: boolean) {}
}

export class DeleteCustomerController {
  public constructor(private readonly _useCase: DeleteCustomerUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      if (!req.query.customerId) throw new BadRequestError();

      const userInput = { customerId: req.query.customerId as string };

      const result = await this._useCase.execute(userInput);

      const response: DeletedCustomerDto = new DeletedCustomerDto(
        result.deletionComplete
      );

      res.status(200).json(response);
    } catch (err) {
      handleControllerError(res, err);
    }
  }
}
