import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import {
  IUpdateCustomerResult,
  UpdateCustomerUseCase,
} from "../../../application/customer/UpdateCustomerUseCase";
import { handleControllerError } from "../../../shared/HandleControllerError";
import { customerSchema } from "../../../domain/validation_schemas/Customer.Schema";
import { BadRequestError } from "../../../errors/HttpError";

export class UpdatedCustomerDto implements IUpdateCustomerResult {
  public constructor(
    public readonly fName: string,
    public readonly lName: string,
    public readonly email: string,
    public readonly phone: string
  ) {}
}

export class UpdateCustomerController {
  public constructor(private readonly _useCase: UpdateCustomerUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.customerId || !req.body.data) throw new BadRequestError();

      const userInput = {
        customerId: req.query.customerId as string,
        data: {
          fName: req.body.data.fName,
          lName: req.body.data.lName,
          email: req.body.data.email,
          phone: req.body.data.phone,
        },
      };

      const { error, value } = customerSchema.validate(userInput.data);

      if (error) throw new BadRequestError(error.message);

      const result = await this._useCase.execute(userInput);

      const response: UpdatedCustomerDto = new UpdatedCustomerDto(
        result.fName,
        result.lName,
        result.email,
        result.phone
      );

      res.status(200).json(response);
    } catch (err) {
      handleControllerError(res, err);
    }
  }
}
