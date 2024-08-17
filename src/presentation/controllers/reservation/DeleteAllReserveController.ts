import { Request, Response } from "express";
import {
  DeleteAllReserveUseCase,
  IDeleteAllReserveResult,
} from "../../../application/reservation/DeleteAllReserveUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface DeletedAllReserveResponseDto extends IDeleteAllReserveResult {}

export class DeleteAllReserveController {
  public constructor(private readonly _useCase: DeleteAllReserveUseCase) {}
  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._useCase.execute(null);

      const response: DeletedAllReserveResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
