import { Request, Response } from "express";
import {
  FindDistrictsByProvinceUseCase,
  IFindDistsByProvinceDto,
  IFindDistsByProvinceResult,
} from "../../../application/address/FindDistrictsByProvinceUseCast";
import { BadRequestError } from "../../../errors/HttpError";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface DistsByProvinceResponseDto
  extends IFindDistsByProvinceResult {}

export class FindDistrictsByProvinceController {
  public constructor(
    private readonly _useCase: FindDistrictsByProvinceUseCase
  ) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const inputId = req.params.id as unknown;

      if (!Number(inputId))
        throw new BadRequestError(`/:id must be a number not string`);

      const userInput: IFindDistsByProvinceDto = {
        id: Number(inputId),
      };

      const result = await this._useCase.execute(userInput);

      const response: DistsByProvinceResponseDto = {
        province_id: result.province_id,
        data: result.data,
      };

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
