import { Request, Response } from "express";
import {
  DeletePayUrlUseCase,
  IDeletePayUrlDto,
  IDeletePayUrlResult,
} from "../../../application/reservation/DeletePayUrlUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface DeletedPayUrlResponseDto extends IDeletePayUrlResult {}

export class DeletePayUrlController {
  public constructor(private readonly _useCase: DeletePayUrlUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      if (!req.query.reserveId) throw new BadRequestError();

      const userInput: IDeletePayUrlDto = {
        reserveId: req.query.reserveId as string,
      };

      const result = await this._useCase.execute(userInput);

      const response: DeletedPayUrlResponseDto = {
        reserveId: result.reserveId,
        customerId: result.customerId,
        payImgUrl: result.payImgUrl,
      };

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
