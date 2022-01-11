export class HttpError extends Error {
  constructor(message: string, private readonly _status: number) {
    super(message);
    console.log(message);
  }

  public get status() {
    return this._status;
  }

  public toString(): string {
    return `[HttpError]: ${this.status} - ${this.message}`;
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "") {
    super(message, 404);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "") {
    super(message, 403);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "") {
    super(message, 400);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "") {
    super(message, 401);
  }
}

export class NotAllowedError extends HttpError {
  constructor(message = "") {
    super(message, 405);
  }
}
