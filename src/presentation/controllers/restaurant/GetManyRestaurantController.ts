import { Request, Response } from "express";
import {
  IGetManyRestaurantResult,
  IGetManyRestaurantUseCase,
} from "../../../application/restaurant/GetManyRestaurantUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { TOKEN_NAME } from "../../../shared/constants";
import { UnauthorizedActionError } from "../../../errors/UseCaseError";
import { IFilterRestaurant } from "../../../shared/searchFilter";

interface GetManyRestaurantReqBody {
  page: number;
  filterBy?: IFilterRestaurant;
}

export interface GetManyRestaurantResponseDto
  extends IGetManyRestaurantResult {}

export class GetManyRestaurantController {
  constructor(private readonly _useCase: IGetManyRestaurantUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const options: GetManyRestaurantReqBody = {
        page: req.body.page,
        filterBy: req.body.filterBy,
      };

      this._useCase.setPagination(options.page, options.filterBy);

      const results = await this._useCase.execute(null);

      const response: GetManyRestaurantResponseDto = results;

      if (response.data.length <= 0) {
        res.sendStatus(StatusCode.NO_CONTENT);
        return;
      }

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
