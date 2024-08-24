import { Request, Response } from "express";
import {
  DeleteReserveUseCase,
  IDeleteReserveDto,
  IDeleteReserveResult,
} from "../../../application/reservation/DeleteReserveUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface DeletedReserveResponseDto extends IDeleteReserveResult {}

export class DeleteReserveController {
  public constructor(private readonly _useCase: DeleteReserveUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      if (!req.query.reserveId) throw new BadRequestError();

      const userInput: IDeleteReserveDto = {
        reserveId: req.query.reserveId as string,
      };

      const result = await this._useCase.execute(userInput);

      const response: DeletedReserveResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
