import { Request, Response } from "express";
import {
  IUpdateCusProImgDto,
  IUpdateCusProImgResult,
  UpdateCustomerProfileImgUseCase,
} from "../../../application/customer/UpdateCustomerProfileImgUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface UpdatedCusProfImgResponseDto extends IUpdateCusProImgResult {}

export class UpdateCustomerProfImgController {
  public constructor(
    private readonly _useCase: UpdateCustomerProfileImgUseCase
  ) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.customerId || !req.file) throw new BadRequestError();

      const userInput: IUpdateCusProImgDto = {
        customerId: req.query.customerId as string,
        profileImg: req.file.buffer,
      };

      const result = await this._useCase.execute(userInput);

      const response: UpdatedCusProfImgResponseDto = {
        customerId: result.customerId,
        fName: result.fName,
        lName: result.lName,
        phone: result.phone,
        email: result.email,
        profileImgPath: result.profileImgPath,
      };

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
