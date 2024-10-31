import { Request, Response } from "express";
import {
  FindSubDistsByDistrictUseCase,
  IFindSubDistsByDistrictDto,
  IFindSubDistsByDistrictResult,
} from "../../../application/address/FindSubDistsByDistrictUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";

export interface SubDistsByDistrictResponseDto
  extends IFindSubDistsByDistrictResult {}

export class FindSubDistsByDistrictController {
  public constructor(
    private readonly _useCase: FindSubDistsByDistrictUseCase
  ) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const inputId = req.params.id as unknown;

      if (!Number(inputId))
        throw new BadRequestError(`/:id must be a number not string`);

      const userInput: IFindSubDistsByDistrictDto = {
        id: Number(inputId),
      };

      const result = await this._useCase.execute(userInput);

      const response: SubDistsByDistrictResponseDto = {
        district_id: result.district_id,
        data: result.data,
      };

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
