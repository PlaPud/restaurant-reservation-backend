import { Request, Response } from "express";
import {
  GetReserveUseCase,
  IGetReserveDto,
  IGetReserveResult,
} from "../../../application/reservation/GetReserveUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface GetReserveResponseDto extends IGetReserveResult {}

export class GetReserveController {
  constructor(private readonly _useCase: GetReserveUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const userInput: IGetReserveDto = {
        reserveId: req.query.reserveId as string,
      };

      const result = await this._useCase.execute(userInput);

      const response: GetReserveResponseDto = result;
      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
