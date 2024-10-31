import { Request, response, Response } from "express";
import {
  ICreateRestaurantDto,
  ICreateRestaurantResult,
  ICreateRestaurantUseCase,
} from "../../../application/restaurant/CreateRestaurantUseCase";
import { createRestaurantSchema } from "../../../domain/validation_schemas/Restaurant.Schema";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { TOKEN_NAME } from "../../../shared/constants";
import { UnauthorizedActionError } from "../../../errors/UseCaseError";

export interface CreatedRestaurantResponseDto extends ICreateRestaurantResult {}

export class CreateRestaurantController {
  constructor(private readonly _useCase: ICreateRestaurantUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (req.cookies[TOKEN_NAME]) throw new UnauthorizedActionError();

      const {
        name,
        phone,
        address,
        subDistrict,
        district,
        province,
        email,
        password,
      } = req.body;

      const userInput: ICreateRestaurantDto = {
        name,
        phone,
        address,
        email,
        password,
        subDistrict,
        district,
        province,
      };

      const { error, value } = createRestaurantSchema.validate(userInput);

      if (error) throw new BadRequestError(error.message);

      const result = await this._useCase.execute(value);

      const response: CreatedRestaurantResponseDto = {
        restaurantId: result.restaurantId,
        name: result.name,
        phone: result.phone,
        address: result.address,
        subDistrict: result.subDistrict,
        district: result.district,
        province: result.province,
        email: result.email,
      };

      res.status(StatusCode.CREATED).json(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
