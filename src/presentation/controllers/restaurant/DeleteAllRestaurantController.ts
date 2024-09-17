import { Request, Response } from "express";
import {
  IDeleteAllRestaurantResult,
  IDeleteAllRestaurantUseCase,
} from "../../../application/restaurant/DeleteAllRestaurantUseCase";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { TOKEN_NAME } from "../../../shared/constants";
import { UnauthorizedActionError } from "../../../errors/UseCaseError";
import { IVerifyRoleResult, JwtService } from "../../../services/JwtService";
import { TokenRole } from "../../../shared/enum/TokenRole";

export interface DeletedAllRestaurantResponseDto
  extends IDeleteAllRestaurantResult {}

export class DeleteAllRestaurantController {
  private readonly _jwtService: JwtService;

  constructor(private readonly _useCase: IDeleteAllRestaurantUseCase) {
    this._jwtService = new JwtService();
  }

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._useCase.execute(null);

      const response: DeletedAllRestaurantResponseDto = {
        deletionComplete: result.deletionComplete,
      };

      res.status(StatusCode.OK).send(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
