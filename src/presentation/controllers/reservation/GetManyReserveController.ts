import { Request, Response } from "express";
import {
  GetManyReserveUseCase,
  IGetManyReserveDto,
  IGetManyReserveResult,
} from "../../../application/reservation/GetManyReserveUseCase";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { BadRequestError } from "../../../errors/HttpError";

export interface GetManyReserveReqBody {
  page: number;
  searchQuery: string;
}

export interface GetManyReserveResponseDto extends IGetManyReserveResult {}

export class GetManyReserveController {
  public constructor(private readonly _useCase: GetManyReserveUseCase) {}

  public async handle(req: Request, res: Response) {
    try {
      if (!req.query.restaurantId && !req.query.customerId)
        throw new BadRequestError();

      this._useCase.setSearching(
        req.query.page ? Number(req.query.page) : 1,
        req.query.searchQuery ? String(req.query.searchQuery) : ""
      );

      // console.log(req.query);

      const userInput: IGetManyReserveDto = {
        restaurantId: req.query.restaurantId
          ? String(req.query.restaurantId)
          : undefined,
        customerId: req.query.customerId
          ? String(req.query.customerId)
          : undefined,
      };

      console.log(userInput);

      const result = await this._useCase.execute(userInput);

      const response: GetManyReserveResponseDto = result;

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
