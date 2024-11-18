import { Request, Response } from "express";
import {
  GetAttendReserveUseCase,
  IGetAttendReserveDto,
  IGetAttendReserveResult,
} from "../../../application/reservation/GetAttendReserveUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface GetAttendReserveResponseDto extends IGetAttendReserveResult {}

export class GetAttendReserveController {
  public constructor(private readonly _useCase: GetAttendReserveUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.restaurantId && !req.query.customerId)
        throw new BadRequestError();

      const userInput: IGetAttendReserveDto = {
        page: Number(req.query.page) || 1,
        searchQuery: req.query.searchQuery ? String(req.query.searchQuery) : "",
        restaurantId: req.query.restaurantId
          ? String(req.query.restaurantId)
          : undefined,
        customerId: req.query.customerId
          ? String(req.query.customerId)
          : undefined,
      };

      const result = await this._useCase.execute(userInput);

      const response: GetAttendReserveResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
