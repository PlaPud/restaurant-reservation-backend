import { Request, Response } from "express";
import {
  IDeleteRestaurantDto,
  IDeleteRestaurantResult,
  IDeleteRestaurantUseCase,
} from "../../../application/restaurant/DeleteRestaurantUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface DeletedRestaurantResponseDto extends IDeleteRestaurantResult {}

export class DeleteRestaurantController {
  public constructor(private readonly _useCase: IDeleteRestaurantUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const { restaurantId } = req.query;

      if (!restaurantId) throw new BadRequestError();

      const userInput: IDeleteRestaurantDto = {
        restaurantId: restaurantId as string,
      };

      const result = await this._useCase.execute(userInput);

      const response: DeletedRestaurantResponseDto = {
        deletionComplete: result.deletionComplete,
        deletedId: result.deletedId,
      };

      res.status(StatusCode.OK).send(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
