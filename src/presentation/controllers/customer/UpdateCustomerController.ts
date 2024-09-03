import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import {
  IUpdateCustomerResult,
  UpdateCustomerUseCase,
} from "../../../application/customer/UpdateCustomerUseCase";
import { sendErrorResponse } from "../../../shared/sendErrorResponse";
import { customerSchema } from "../../../domain/validation_schemas/Customer.Schema";
import { BadRequestError } from "../../../errors/HttpError";
import { StatusCode } from "../../../shared/enum/StatusCode";
import { TOKEN_NAME } from "../../../shared/constants";
import { IVerifyRoleResult, JwtService } from "../../../services/JwtService";
import { TokenRole } from "../../../shared/enum/TokenRole";
import { UnauthorizedActionError } from "../../../errors/UseCaseError";
import { isRequestFromOwner as isRequestByOwner } from "../../../shared/utilsFunc";

export class UpdatedCustomerDto implements IUpdateCustomerResult {
  public constructor(
    public customerId: string,
    public readonly fName: string,
    public readonly lName: string,
    public readonly email: string,
    public readonly phone: string
  ) {}
}

export class UpdateCustomerController {
  private readonly _jwtService: JwtService;

  public constructor(private readonly _useCase: UpdateCustomerUseCase) {
    this._jwtService = new JwtService();
  }

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.query.customerId || !req.body.data) throw new BadRequestError();

      if (!req.cookies[TOKEN_NAME]) throw new UnauthorizedActionError();

      const verifyResult: IVerifyRoleResult =
        await this._jwtService.verifyTokenRole({
          token: req.cookies[TOKEN_NAME],
          toHaveRole: [TokenRole.CUSTOMER],
        });

      if (
        !verifyResult.isAuthorized ||
        !isRequestByOwner({
          verifyResult,
          req,
          ownerRole: TokenRole.CUSTOMER,
        })
      ) {
        throw new UnauthorizedActionError(
          `Role Violation Error (Request Must be from the same customerId)`
        );
      }

      const userInput = {
        customerId: req.query.customerId as string,
        data: {
          fName: req.body.data.fName,
          lName: req.body.data.lName,
          email: req.body.data.email,
          phone: req.body.data.phone,
          password: req.body.data.password,
        },
      };

      const { error, value } = customerSchema.validate(userInput.data);

      if (error) throw new BadRequestError(error.message);

      const result = await this._useCase.execute(userInput);

      const response: UpdatedCustomerDto = new UpdatedCustomerDto(
        result.customerId,
        result.fName,
        result.lName,
        result.email,
        result.phone
      );

      res.status(StatusCode.OK).json(response);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
