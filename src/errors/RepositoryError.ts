export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RepositoryError";
  }
}

export class DatabaseConnectionError extends RepositoryError {
  constructor(message: string = "Database connection failed") {
    super(message);
    this.name = "DatabaseConnectionError";
  }
}

export class DataIntegrityError extends RepositoryError {
  constructor(message: string = "Data integrity issue") {
    super(message);
    this.name = "DataIntegrityError";
  }
}
