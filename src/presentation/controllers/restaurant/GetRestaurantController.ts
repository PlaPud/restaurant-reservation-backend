import { Request, Response } from "express";
import {
  IGetRestaurantDto,
  IGetRestaurantResult,
  IGetRestaurantUseCase,
} from "../../../application/restaurant/GetRestaurantUseCase";
import { IGetCustomerDto } from "../../../application/customer/GetCustomerUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { TOKEN_NAME } from "../../../shared/constants";
import { UnauthorizedActionError } from "../../../errors/UseCaseError";
import { BadRequestError } from "../../../errors/HttpError";

export interface GetRestaurantResponseDto extends IGetRestaurantResult {}

export class GetRestaurantController {
  public constructor(private readonly _useCase: IGetRestaurantUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.restaurantId) throw new BadRequestError();

      const { restaurantId } = req.query;

      const userInput: IGetRestaurantDto = {
        restaurantId: restaurantId as string,
      };

      const result = await this._useCase.execute(userInput);

      const response: GetRestaurantResponseDto = {
        restaurantId: result.restaurantId,
        name: result.name,
        email: result.email,
        phone: result.phone,
        address: result.address,
        subDistrict: result.subDistrict,
        district: result.district,
        province: result.province,
        profileImgPath: result.profileImgPath,
        description: result.description,
        reservation: result.reservation,
      };

      res.status(StatusCode.OK).send(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
