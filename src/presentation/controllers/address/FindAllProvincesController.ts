import { Request, Response } from "express";
import {
  FindAllProvincesUseCase,
  IFindAllProvincesResult,
} from "../../../application/address/FindAllProvincesUseCase";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface AllProvincesResponseDto extends IFindAllProvincesResult {}

export class FindAllProvincesController {
  public constructor(private readonly _useCase: FindAllProvincesUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._useCase.execute(null);

      const response: AllProvincesResponseDto = {
        data: result.data,
      };

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
