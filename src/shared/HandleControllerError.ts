import { STATUS_CODES } from "http";
import {
  UseCaseError,
  BusinessRuleViolationError,
  UnauthorizedActionError,
} from "../errors/UseCaseError";
import { StatusCode } from "./enum/StatusCode";
import { Response } from "express";
import { BadRequestError, HttpError, NotFoundError } from "../errors/HttpError";
import {
  DomainError,
  DomainValidationError,
  EntityNotFoundError,
} from "../errors/DomainError";
import {
  DatabaseConnectionError,
  DataIntegrityError,
  RepositoryError,
} from "../errors/RepositoryError";
import { error } from "console";

export const handleControllerError = async (
  res: Response,
  err: unknown
): Promise<void> => {
  if (err instanceof HttpError) {
    httpErrHandler(res, err);
    return;
  }

  if (err instanceof UseCaseError) {
    useCaseErrHandler(res, err);
    return;
  }

  if (err instanceof RepositoryError) {
    repoErrHandler(res, err);
    return;
  }

  if (err instanceof DomainError) {
    domainErrHandler(res, err);
    return;
  }

  res
    .status(StatusCode.INTERNAL_SERVER_ERROR)
    .json({ error: STATUS_CODES[StatusCode.INTERNAL_SERVER_ERROR] });
};

const httpErrHandler = (res: Response, err: unknown): void => {
  if (err instanceof NotFoundError) {
    res.status(StatusCode.NOT_FOUND).json({ error: err.message });
    return;
  }

  if (err instanceof BadRequestError) {
    res.status(StatusCode.BAD_REQUEST).json({ error: err.message });
  }
};

const useCaseErrHandler = (res: Response, err: UseCaseError): void => {
  if (err instanceof BusinessRuleViolationError) {
    res
      .status(StatusCode.BAD_REQUEST)
      .json({ error: (err as BusinessRuleViolationError).message });
    return;
  }

  if (err instanceof UnauthorizedActionError) {
    res
      .status(StatusCode.UNAUTHORIZED)
      .json({ error: (err as UnauthorizedActionError).message });
    return;
  }

  res.status(StatusCode.BAD_REQUEST).json({ error: "An error occured" });
  return;
};

const repoErrHandler = (res: Response, err: RepositoryError): void => {
  if (err instanceof DataIntegrityError) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: err.message });
    return;
  }

  if (err instanceof DatabaseConnectionError) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: err.message });
    return;
  }

  res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: err.message });
  return;
};

const domainErrHandler = (res: Response, err: unknown): void => {
  if (err instanceof EntityNotFoundError) {
    res.status(StatusCode.NOT_FOUND).json({ error: err.message });
    return;
  }

  if (err instanceof DomainValidationError) {
    res.status(StatusCode.BAD_REQUEST).json({ error: err.message });
    return;
  }
};
