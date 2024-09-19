import { Request, Response } from "express";
import {
  GetManyReserveUseCase,
  IGetManyReserveResult,
} from "../../../application/reservation/GetManyReserveUseCase";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface GetManyReserveResponseDto extends IGetManyReserveResult {}

export class GetManyReserveController {
  public constructor(private readonly _useCase: GetManyReserveUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      this._useCase.setPagination(req.body.page);

      const result = await this._useCase.execute(null);

      const response: GetManyReserveResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
