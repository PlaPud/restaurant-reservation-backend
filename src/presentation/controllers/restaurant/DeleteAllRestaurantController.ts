import { Request, Response } from "express";
import {
  IDeleteAllRestaurantResult,
  IDeleteAllRestaurantUseCase,
} from "../../../application/restaurant/DeleteAllRestaurantUseCase";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface DeletedAllRestaurantResponseDto
  extends IDeleteAllRestaurantResult {}

export class DeleteAllRestaurantController {
  constructor(private readonly _useCase: IDeleteAllRestaurantUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._useCase.execute(null);

      const response: DeletedAllRestaurantResponseDto = {
        deletionComplete: result.deletionComplete,
      };

      res.status(StatusCode.OK).send(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
