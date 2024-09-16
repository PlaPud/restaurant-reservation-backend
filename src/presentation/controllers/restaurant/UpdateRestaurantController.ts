import { Request, Response } from "express";
import {
  IUpdateRestaurantDto,
  IUpdateRestaurantResult,
  IUpdateRestaurantUseCase,
} from "../../../application/restaurant/UpdateRestaurantUseCase";
import { restaurantSchema } from "../../../domain/validation_schemas/Restaurant.Schema";
import { BadRequestError } from "../../../errors/HttpError";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface UpdateRestaurantResponseDto extends IUpdateRestaurantResult {}

export class UpdateRestaurantController {
  public constructor(private readonly _useCase: IUpdateRestaurantUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.restaurantId || !req.body.data)
        throw new BadRequestError();

      const { name, phone, address, email, password, description } =
        req.body.data;

      const userInput: IUpdateRestaurantDto = {
        restaurantId: req.query.restaurantId as string,
        data: {
          name,
          phone,
          address,
          email,
          password,
          description,
        },
      };

      const { error, value } = restaurantSchema.validate(userInput.data);

      if (error) throw new BadRequestError(error.message);

      const result = await this._useCase.execute(userInput);

      const response: UpdateRestaurantResponseDto = {
        restaurantId: result.restaurantId,
        name: result.name,
        phone: result.phone,
        address: result.address,
        email: result.email,
        description: result.description,
      };

      res.status(StatusCode.OK).send(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
