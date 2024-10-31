import { Request, Response } from "express";
import {
  IMakeReserveDto,
  IMakeReserveResult,
  MakeReserveUseCase,
} from "../../../application/reservation/MakeReserveUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface MadeReserveResponseDto extends IMakeReserveResult {}

export class MakeReserveController {
  public constructor(private readonly _useCase: MakeReserveUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.query.customerId);

      if (!req.query.reserveId || !req.query.customerId)
        throw new BadRequestError();

      const userInput: IMakeReserveDto = {
        customerId: req.query.customerId as string,
        reserveId: req.query.reserveId as string,
      };

      const result = await this._useCase.execute(userInput);

      const response: MadeReserveResponseDto = {
        data: result.data,
      };

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      // console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
