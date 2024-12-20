import { Request, Response } from "express";
import {
  GetPendingReserveUseCase,
  IGetPendingReserveDto,
  IGetPendingReserveResult,
} from "../../../application/reservation/GetPendingReserveUseCase";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface GetPendingReserveReqBody {
  page: number;
  searchQuery: string;
}

export interface GetPendingReserveResponseDto
  extends IGetPendingReserveResult {}

export class GetPendingReserveController {
  public constructor(private readonly _useCase: GetPendingReserveUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      const userInput: IGetPendingReserveDto = {
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

      const response: GetPendingReserveResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
