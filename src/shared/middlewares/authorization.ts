import { NextFunction, Request, Response } from "express";
import { TOKEN_NAME } from "../constants";
import { UnauthorizedActionError } from "../../errors/UseCaseError";
import { JwtService } from "../../services/JwtService";
import { TokenRole } from "../enum/TokenRole";
import { JwtPayload } from "jsonwebtoken";
import { BadRequestError } from "../../errors/HttpError";
import { ReservationAuthService } from "../../services/ReservationAuthService";

export const useSelfData = (roles: TokenRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jwtService = new JwtService();

      const payload: JwtPayload = await jwtService.verifyToken(
        req.cookies[TOKEN_NAME]
      );

      if (payload.role === TokenRole.ADMIN) {
        next();
        return;
      }

      let roleId = "";

      const roleMap: Record<TokenRole, string> = {
        [TokenRole.RESTAURANT]: "restaurantId",
        [TokenRole.CUSTOMER]: "customerId",
        [TokenRole.ADMIN]: "adminId",
      };

      const matchedRole = roles.find((role) => payload.role === role);

      if (!matchedRole) {
        throw new UnauthorizedActionError(`Role Not Authorized`);
      }

      roleId = roleMap[matchedRole];

      req.query[roleId] = payload.sub as string;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export const checkRequestToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies[TOKEN_NAME])
      throw new UnauthorizedActionError(`missing token.`);
    next();
  } catch (err) {
    next(err);
  }
};

export const checkLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.cookies[TOKEN_NAME])
      throw new UnauthorizedActionError(`you must logout first.`);
    next();
  } catch (err) {
    next(err);
  }
};

export const authorizeReqFromRoles = (rolesContext: TokenRole[]) => {
  const authorizeActionCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const jwtService = new JwtService();

      const token = req.cookies[TOKEN_NAME];

      const verify = await jwtService.verifyTokenRole({
        token,
        toHaveRole: rolesContext,
      });

      if (!verify.isAuthorized)
        throw new UnauthorizedActionError(`Role Not Authorized`);
      next();
    } catch (err) {
      next(err);
    }
  };

  return authorizeActionCallback;
};

export const authorizeReqFromOwner = (rolesContext: TokenRole[]) => {
  const roles = {
    customerId: TokenRole.CUSTOMER,
    restaurantId: TokenRole.RESTAURANT,
    adminId: TokenRole.ADMIN,
  };

  const validateOwnership = (req: Request, payload: JwtPayload) => {
    let targetIdKey = "";

    console.log(req.query);

    for (const [roleId, tokenRole] of Object.entries(roles)) {
      // if (!req.query[roleId])
      //   throw new BadRequestError(`Authorized Role Token not exist`);

      if (req.query[roleId] && rolesContext.includes(tokenRole)) {
        targetIdKey = roleId.toString();
      }
    }

    if (targetIdKey === "") {
      throw new UnauthorizedActionError(`Unauthorized Role!`);
    }

    if (payload.sub !== req.query[targetIdKey]) {
      throw new UnauthorizedActionError(`Must edit only your own data.`);
    }
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: JwtPayload = await _getPayloadByValidToken(req);

      if (payload.role === TokenRole.ADMIN) {
        next();
        return;
      }

      validateOwnership(req, payload);
      next();
    } catch (err) {
      next(err);
    }
  };
};

export const authorizeReserveAction = (
  rolesContext: TokenRole[],
  service: ReservationAuthService
) => {
  const validateAuthor = (req: Request, payload: JwtPayload) => {
    const reserveId = req.query.reserveId as string;
    service.validateOwnership(reserveId, payload);
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: JwtPayload = await _getPayloadByValidToken(req);

      if (payload.role === TokenRole.ADMIN) {
        next();
        return;
      }

      validateAuthor(req, payload);

      next();
    } catch (err) {
      next(err);
    }
  };
};

async function _getPayloadByValidToken(req: Request) {
  const jwtService = new JwtService();

  const token = req.cookies[TOKEN_NAME];

  const payload: JwtPayload = await jwtService.verifyToken(token);
  return payload;
}
// export const authorize;
