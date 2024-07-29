export class UseCaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UseCaseError";
  }
}

export class BusinessRuleViolationError extends UseCaseError {
  constructor(message: string = "Business rule violation") {
    super(message);
    this.name = "BusinessRuleViolationError";
  }
}

export class UnauthorizedActionError extends UseCaseError {
  constructor(message: string = "Unauthorized action") {
    super(message);
    this.name = "UnauthorizedActionError";
  }
}
