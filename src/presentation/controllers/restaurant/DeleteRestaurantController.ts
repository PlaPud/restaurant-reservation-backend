import { Request, Response } from "express";
import {
  IDeleteRestaurantDto,
  IDeleteRestaurantResult,
  IDeleteRestaurantUseCase,
} from "../../../application/restaurant/DeleteRestaurantUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { TOKEN_NAME } from "../../../shared/constants";
import { UnauthorizedActionError } from "../../../errors/UseCaseError";
import { IVerifyRoleResult, JwtService } from "../../../services/JwtService";
import { TokenRole } from "../../../shared/enum/TokenRole";

export interface DeletedRestaurantResponseDto extends IDeleteRestaurantResult {}

export class DeleteRestaurantController {
  private readonly _jwtService: JwtService;
  public constructor(private readonly _useCase: IDeleteRestaurantUseCase) {
    this._jwtService = new JwtService();
  }

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const { restaurantId } = req.query;

      if (!restaurantId) throw new BadRequestError();

      const userInput: IDeleteRestaurantDto = {
        restaurantId: restaurantId as string,
      };

      const result = await this._useCase.execute(userInput);

      const response: DeletedRestaurantResponseDto = {
        deletionComplete: result.deletionComplete,
        deletedId: result.deletedId,
      };

      res.status(StatusCode.OK).send(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
