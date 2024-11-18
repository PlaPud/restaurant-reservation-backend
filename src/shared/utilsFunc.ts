import { Request } from "express";
import { IVerifyRoleResult } from "../services/JwtService";
import { UnauthorizedActionError } from "../errors/UseCaseError";
import { TokenRole } from "./enum/TokenRole";
import { startOfDay } from "date-fns";
import { PAGE_SIZE } from "./constants";

export const getTotalPages = (count: number) => Math.ceil(count / PAGE_SIZE);

export const getReservationCutOffTime = () => {
  return Math.floor(startOfDay(new Date()).getTime() / 1000);
};

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

  return idFromRequest === idFromToken;
};
