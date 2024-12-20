import { Request, Response } from "express";
import { CreateCustomerUseCase } from "../../../application/customer/CreateCustomerUseCase";
import {
  CreateReserveUseCase,
  ICreateReserveDto,
  ICreateReserveResult,
} from "../../../application/reservation/CreateReserveUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { newReserveSchema } from "../../../domain/validation_schemas/Reservation.Schema";
import { BadRequestError } from "../../../errors/HttpError";

export interface CreatedReserveResponseDto extends ICreateReserveResult {}

export class CreateReserveController {
  public constructor(private readonly _useCase: CreateReserveUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const { seats, reserveDate, reservePrice } = req.body;

      const userInput: ICreateReserveDto = {
        restaurantId: req.query.restaurantId as string,
        seats,
        reserveDate,
        reservePrice,
      };

      const { error, value } = newReserveSchema.validate(userInput);

      if (error) throw new BadRequestError(error.message);

      const result: ICreateReserveResult = await this._useCase.execute(
        value as ICreateReserveDto
      );

      const response: CreatedReserveResponseDto = {
        reserveId: result.reserveId,
        restaurantId: result.restaurantId,
        seats: result.seats as number,
        lastModified: result.lastModified,
        reserveDate: result.reserveDate,
        restaurant: result.restaurant,
      };

      res.status(StatusCode.CREATED).json(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
