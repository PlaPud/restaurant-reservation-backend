import { Request, Response } from "express";
import {
  IUpdateReserveDto,
  IUpdateReserveResult,
  UpdateReserveUseCase,
} from "../../../application/reservation/UpdateReserveUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { updateReserveSchema } from "../../../domain/validation_schemas/Reservation.Schema";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { isRequestBodyEmpty } from "../../../shared/utilsFunc";

export interface UpdatedReserveResponseDto extends IUpdateReserveResult {}

export class UpdateReserveController {
  public constructor(private readonly _useCase: UpdateReserveUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.reserveId || isRequestBodyEmpty(req))
        throw new BadRequestError();

      const userInput: IUpdateReserveDto = {
        reserveId: req.query.reserveId as string,
        data: req.body,
      };

      const { error, value } = updateReserveSchema.validate(userInput.data);

      if (error) throw new BadRequestError(error.message);

      const result = await this._useCase.execute(userInput);

      const response: UpdatedReserveResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
