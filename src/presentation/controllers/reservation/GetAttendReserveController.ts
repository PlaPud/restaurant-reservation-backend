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
      if (!req.query.restaurantId) throw new BadRequestError();

      const userInput: IGetAttendReserveDto = {
        restaurantId: req.query.restaurantId as string,
        page: Number(req.query.page) || 1,
        searchQuery: req.query.searchQuery ? String(req.query.searchQuery) : "",
      };

      const result = await this._useCase.execute(userInput);

      const response: GetAttendReserveResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
