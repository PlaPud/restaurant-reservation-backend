import { Request, Response } from "express";
import {
  IUpdateAttendDto,
  IUpdateAttendResult,
  UpdateAttendUseCase,
} from "../../../application/reservation/UpdateAttendUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface UpdatedAttendResponseDto extends IUpdateAttendResult {}

export class UpdateAttendController {
  public constructor(private readonly _useCase: UpdateAttendUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.reserveId || !req.body) throw new BadRequestError();

      const userInput: IUpdateAttendDto = {
        reserveId: req.query.reserveId as string,
        isAttended: req.body.isAttended,
      };

      const result = await this._useCase.execute(userInput);

      const response: UpdatedAttendResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
