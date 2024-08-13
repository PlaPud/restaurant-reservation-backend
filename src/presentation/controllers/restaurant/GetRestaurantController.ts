import { Request, Response } from "express";
import {
  IGetRestaurantDto,
  IGetRestaurantResult,
  IGetRestaurantUseCase,
} from "../../../application/restaurant/GetRestaurantUseCase";
import { IGetCustomerDto } from "../../../application/customer/GetCustomerUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface GetRestaurantResponseDto extends IGetRestaurantResult {}

export class GetRestaurantController {
  public constructor(private readonly _useCase: IGetRestaurantUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const { restaurantId } = req.query;

      const userInput: IGetRestaurantDto = {
        restaurantId: restaurantId as string,
      };

      const result = await this._useCase.execute(userInput);

      const response: GetRestaurantResponseDto = {
        restaurantId: result.restaurantId,
        name: result.name,
        phone: result.phone,
        address: result.address,
        currentReserves: result.currentReserves,
      };

      res.status(StatusCode.OK).send(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
