import { Request, Response } from "express";
import {
  IUpdateRestaurantDto,
  IUpdateRestaurantResult,
  IUpdateRestaurantUseCase,
} from "../../../application/restaurant/UpdateRestaurantUseCase";
import {
  createRestaurantSchema,
  updateRestaurantSchema,
} from "../../../domain/validation_schemas/Restaurant.Schema";
import { BadRequestError } from "../../../errors/HttpError";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface UpdateRestaurantResponseDto extends IUpdateRestaurantResult {}

export class UpdateRestaurantController {
  public constructor(private readonly _useCase: IUpdateRestaurantUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body);

      if (!req.query.restaurantId || !req.body) throw new BadRequestError();

      const {
        name,
        phone,
        address,
        subDistrict,
        district,
        province,
        email,
        description,
        paymentInfo,
      } = req.body;

      const userInput: IUpdateRestaurantDto = {
        restaurantId: req.query.restaurantId as string,
        data: {
          name,
          phone,
          address,
          email,
          subDistrict,
          district,
          province,
          description,
          paymentInfo,
        },
      };

      const { error, value } = updateRestaurantSchema.validate(userInput.data);

      if (error) throw new BadRequestError(error.message);

      const result = await this._useCase.execute(userInput);

      const response: UpdateRestaurantResponseDto = {
        restaurantId: result.restaurantId,
        name: result.name,
        phone: result.phone,
        address: result.address,
        email: result.email,
        description: result.description,
        subDistrict: result.subDistrict,
        district: result.district,
        province: result.province,
        paymentInfo: result.paymentInfo,
      };

      res.status(StatusCode.OK).send(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
