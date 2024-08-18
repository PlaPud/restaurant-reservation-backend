import { Request, Response } from "express";
import {
  GetAllReserveUseCase,
  IGetAllReserveResult,
} from "../../../application/reservation/GetAllReserveUseCase";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface GetAllReserveResponseDto extends IGetAllReserveResult {}

export class GetAllReserveController {
  public constructor(private readonly _useCase: GetAllReserveUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      const result = await this._useCase.execute(null);

      const response: GetAllReserveResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
