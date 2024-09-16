import { Request, Response } from "express";
import {
  IUpdateResProfileDto,
  IUpdateResProfileResult,
  UpdateRestaurantProfileImgUseCase,
} from "../../../application/restaurant/UpdateRestaurantProfileImgUseCase";
import { IUpdateRestaurantDto } from "../../../application/restaurant/UpdateRestaurantUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface UpdatedResProfileImgResponseDto
  extends IUpdateResProfileResult {}

export class UpdateRestaurantProfileImgController {
  public constructor(
    private readonly _useCase: UpdateRestaurantProfileImgUseCase
  ) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.restaurantId || !req.file) throw new BadRequestError();

      const userInput: IUpdateResProfileDto = {
        restaurantId: req.query.restaurantId as string,
        profileImg: req.file.buffer,
      };

      const result: IUpdateResProfileResult = await this._useCase.execute(
        userInput
      );

      const response: UpdatedResProfileImgResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
