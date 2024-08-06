import { Request, Response } from "express";
import {
  CreateCustomerUseCase,
  ICreateCustomerDto,
  ICreateCustomerResult,
} from "../../../application/customer/CreateCustomerUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { customerSchema } from "../../../domain/validation_schemas/Customer.Schema";
import { handleControllerError } from "../../../shared/HandleControllerError";
import { BadRequestError } from "../../../errors/HttpError";

export class CreatedCustomerDto implements ICreateCustomerResult {
  public constructor(public readonly customerId: string) {}
}

export class CreateCustomerController {
  public constructor(private readonly _useCase: CreateCustomerUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const userInput = {
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        phone: req.body.phone,
      };

      const { error, value } = customerSchema.validate(userInput);

      if (error) throw new BadRequestError(error.message);

      const result = await this._useCase.execute(value);

      const response: CreatedCustomerDto = new CreatedCustomerDto(
        result.customerId
      );

      res.status(StatusCode.CREATED).json(response);
    } catch (err) {
      handleControllerError(res, err);
    }
  }
}
