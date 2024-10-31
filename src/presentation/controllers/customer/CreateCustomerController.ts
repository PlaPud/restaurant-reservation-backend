import { Request, Response } from "express";
import {
  CreateCustomerUseCase,
  ICreateCustomerDto,
  ICreateCustomerResult,
} from "../../../application/customer/CreateCustomerUseCase";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { createCustomerSchema } from "../../../domain/validation_schemas/Customer.Schema";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { BadRequestError } from "../../../errors/HttpError";
import { TOKEN_NAME } from "../../../shared/constants";
import { UnauthorizedActionError } from "../../../errors/UseCaseError";
import { IVerifyRoleResult, JwtService } from "../../../services/JwtService";

export class CreatedCustomerDto implements ICreateCustomerResult {
  public constructor(public readonly customerId: string) {}
}

export class CreateCustomerController {
  private readonly _jwtService: JwtService;

  public constructor(private readonly _useCase: CreateCustomerUseCase) {
    this._jwtService = new JwtService();
  }

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      // if (req.cookies[TOKEN_NAME]) throw new UnauthorizedActionError();

      const userInput = {
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      };

      const { error, value } = createCustomerSchema.validate(userInput);

      if (error) throw new BadRequestError(error.message);

      const result = await this._useCase.execute(value);

      const response: CreatedCustomerDto = new CreatedCustomerDto(
        result.customerId
      );

      res.status(StatusCode.CREATED).json(response);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
}
