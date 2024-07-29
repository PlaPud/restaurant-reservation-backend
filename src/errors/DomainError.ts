export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(message: string = "Entity not found") {
    super(message);
    this.name = "EntityNotFoundError";
  }
}

export class DomainValidationError extends DomainError {
  constructor(message: string = "Domain validation error") {
    super(message);
    this.name = "DomainValidationError";
  }
}
