import { Request, Response } from "express";
import {
  GetBookedReserveUseCase,
  IGetBookedReserveDto,
  IGetBookedReserveResult,
} from "../../../application/reservation/GetBookedReserveUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { BadRequestError } from "../../../errors/HttpError";

export interface GetBookedReserveResponseDto extends IGetBookedReserveResult {}

export class GetBookedReserveController {
  public constructor(private readonly _useCase: GetBookedReserveUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.restaurantId) throw new BadRequestError();

      const userInput: IGetBookedReserveDto = {
        restaurantId: req.query.restaurantId as string,
        page: Number(req.query.page) || 1,
        searchQuery: req.query.searchQuery ? String(req.query.searchQuery) : "",
      };

      // this._useCase.setSearching(req.body.page);

      const result = await this._useCase.execute(userInput);

      const response: IGetBookedReserveResult = result;

      res.status(StatusCode.OK).send(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
