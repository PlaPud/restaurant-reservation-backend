export class HttpError extends Error {
  public readonly statusCode: number;

  public constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
}

export class NotFoundError extends HttpError {
  public constructor(message: string = "Data Not Found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends HttpError {
  public constructor(message: string = "Bad Request") {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

export class InternalServerError extends HttpError {
  public constructor(message: string = "Internal Server Error") {
    super(message, 500);
    this.name = "InternalServerError";
  }
}
