import { Request, Response } from "express";
import {
  IGetAllRestaurantResult,
  IGetAllRestaurantUseCase,
} from "../../../application/restaurant/GetAllRestaurantUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface GetAllRestaurantResponseDto extends IGetAllRestaurantResult {}

export class GetAllRestaurantController {
  constructor(private readonly _useCase: IGetAllRestaurantUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const results = await this._useCase.execute(null);

      const response: GetAllRestaurantResponseDto = results;

      if (response.data.length <= 0) {
        res.sendStatus(StatusCode.NO_CONTENT);
        return;
      }

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
