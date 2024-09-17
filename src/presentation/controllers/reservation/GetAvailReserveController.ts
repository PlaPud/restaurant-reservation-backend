import { Request, Response } from "express";
import {
  GetAvailReserveUseCase,
  IGetAvailReserveDto,
  IGetAvailReserveResult,
} from "../../../application/reservation/GetAvailReserveUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { BadRequestError } from "../../../errors/HttpError";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface GetAvailReserveResponseDto extends IGetAvailReserveResult {}

export class GetAvailReserveController {
  public constructor(private readonly _useCase: GetAvailReserveUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.restaurantId) throw new BadRequestError();

      const userInput: IGetAvailReserveDto = {
        restaurantId: req.query.restaurantId as string,
      };

      this._useCase.setPagination(req.body.page);

      const result = await this._useCase.execute(userInput);

      const response: GetAvailReserveResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
