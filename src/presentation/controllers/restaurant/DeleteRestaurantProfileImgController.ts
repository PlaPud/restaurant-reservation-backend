import { Request, Response } from "express";
import {
  DeleteRestaurantProfileImgUseCase,
  IDeleteResProfileDto,
  IDeleteResProfileResult,
} from "../../../application/restaurant/DeleteRestaurantProfileImgUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface DeletedResProfileImgResponseDto
  extends IDeleteResProfileResult {}

export class DeleteRestaurantProfileImgController {
  public constructor(
    private readonly _useCase: DeleteRestaurantProfileImgUseCase
  ) {}

  public async handle(req: Request, res: Response) {
    try {
      const userInput: IDeleteResProfileDto = {
        restaurantId: req.query.restaurantId as string,
      };

      const result = await this._useCase.execute(userInput);

      const response: DeletedResProfileImgResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
