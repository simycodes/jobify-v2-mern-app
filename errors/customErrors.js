import { StatusCodes } from "http-status-codes";

// NOTE:
// By creating a custom error class like [these below], you can provide more specific error 
// messages and properties to help with debugging and error handling in your application. John S

export class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = "NotFoundError",
      this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.name = "BadRequestError",
      this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthenticatedError",
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthenticatedError",
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

