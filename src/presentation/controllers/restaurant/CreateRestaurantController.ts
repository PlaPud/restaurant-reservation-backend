import { Request, response, Response } from "express";
import {
  ICreateRestaurantDto,
  ICreateRestaurantResult,
  ICreateRestaurantUseCase,
} from "../../../application/restaurant/CreateRestaurantUseCase";
import { restaurantSchema } from "../../../domain/validation_schemas/Restaurant.Schema";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface CreatedRestaurantResponseDto extends ICreateRestaurantResult {}

export class CreateRestaurantController {
  constructor(private readonly _useCase: ICreateRestaurantUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const { name, phone, address } = req.body;

      const userInput: ICreateRestaurantDto = {
        name,
        phone,
        address,
      };

      const { error, value } = restaurantSchema.validate(userInput);

      if (error) throw new BadRequestError(error.message);

      const result = await this._useCase.execute(value);

      const response: CreatedRestaurantResponseDto = {
        restaurantId: result.restaurantId,
        name: result.name,
        phone: result.phone,
        address: result.address,
      };

      res.status(StatusCode.CREATED).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
