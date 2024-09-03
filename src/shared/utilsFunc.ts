import { Request } from "express";
import { IVerifyRoleResult } from "../services/JwtService";
import { UnauthorizedActionError } from "../errors/UseCaseError";
import { TokenRole } from "./enum/TokenRole";

export const isRequestBodyEmpty = (req: Request) =>
  Object.keys(req.body).length === 0;

export const isRequestFromOwner = (options: {
  verifyResult: IVerifyRoleResult;
  req: Request;
  ownerRole: TokenRole;
}) => {
  const { verifyResult, req, ownerRole } = options;

  let roleIdField: string;

  switch (ownerRole) {
    case TokenRole.CUSTOMER:
      roleIdField = "customerId";
      break;
    case TokenRole.RESTAURANT:
      roleIdField = "restaurantId";
      break;
    case TokenRole.ADMIN:
      roleIdField = "adminId";
      break;
    default:
      roleIdField = "customerId";
      break;
  }

  const idFromToken = verifyResult.payload.sub;
  const idFromRequest = req.query[roleIdField] as string;

  return idFromRequest !== idFromToken;
};
