import { Request, Response } from "express";
import { IUpdatePayedResult } from "../../../application/reservation/UpdatePayedUseCase";
import {
  IUpdatePayUrlDto,
  IUpdatePayUrlResult,
  UpdatePayUrlUseCase,
} from "../../../application/reservation/UpdatePayUrlUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { isRequestBodyEmpty } from "../../../shared/utilsFunc";

export interface UpdatedPayUrlResponseDto extends IUpdatePayUrlResult {}

export class UpdatePayUrlController {
  public constructor(private readonly _useCase: UpdatePayUrlUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      if (!req.query.reserveId || isRequestBodyEmpty(req))
        throw new BadRequestError();

      const userInput: IUpdatePayUrlDto = {
        reserveId: req.query.reserveId as string,
        payImgUrl: req.body.payImgUrl,
      };

      const result = await this._useCase.execute(userInput);

      const response: UpdatedPayUrlResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
