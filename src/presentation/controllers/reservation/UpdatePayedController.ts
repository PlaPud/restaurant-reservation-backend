import { Request, Response } from "express";
import {
  IUpdatePayedDto,
  IUpdatePayedResult,
  UpdatePayedUseCase,
} from "../../../application/reservation/UpdatePayedUseCase";
import { IUpdateCustomerDto } from "../../../application/customer/UpdateCustomerUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface UpdatedPayedResponseDto extends IUpdatePayedResult {}

export class UpdatePayedController {
  public constructor(private readonly _useCase: UpdatePayedUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      if (!req.query.reserveId || !req.body) throw new BadRequestError();

      const userInput: IUpdatePayedDto = {
        reserveId: req.query.reserveId as string,
        isPayed: req.body.isPayed,
      };

      const result = await this._useCase.execute(userInput);

      const response: UpdatedPayedResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
