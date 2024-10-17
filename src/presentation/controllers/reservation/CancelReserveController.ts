import { Request, Response } from "express";
import {
  CancelReserveUseCase,
  ICancelReserveDto,
  ICancelReserveResult,
} from "../../../application/reservation/CancelReserveUseCase";
import { ReservationJSONResponse } from "../../../domain/Reservation";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface CancelledReserveResponseDto extends ICancelReserveResult {}

export class CancelReserveController {
  public constructor(private readonly _useCase: CancelReserveUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.reserveId) throw new BadRequestError();

      const userInput: ICancelReserveDto = {
        reserveId: req.query.reserveId as string,
      };

      const result = await this._useCase.execute(userInput);

      const response: CancelledReserveResponseDto = {
        data: result.data,
      };

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
