import { Request, Response } from "express";
import {
  DeleteCustomerProfImgUseCase,
  IDeleteCusProDto,
  IDeleteCusProResult,
} from "../../../application/customer/DeleteCustomerProfileImgUseCase";
import { BadRequestError } from "../../../errors/HttpError";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { StatusCode } from "../../../shared/enum/StatusCode";

export interface DeletedCusProfImgResponseDto extends IDeleteCusProResult {}

export class DeleteCustomerProfImgController {
  public constructor(private readonly _useCase: DeleteCustomerProfImgUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.customerId) throw new BadRequestError();

      const userInput: IDeleteCusProDto = {
        customerId: req.query.customerId as string,
      };

      const result = await this._useCase.execute(userInput);

      const response: DeletedCusProfImgResponseDto = {
        customerId: result.customerId,
        fName: result.fName,
        lName: result.lName,
        email: result.email,
        phone: result.phone,
        profileImgPath: result.profileImgPath,
      };

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
