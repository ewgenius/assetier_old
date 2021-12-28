export class HttpError extends Error {
  constructor(message: string, private readonly _status: number) {
    super(message);
  }

  public get status() {
    return this._status;
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "") {
    super(message, 404);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = "") {
    super(message, 403);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = "") {
    super(message, 401);
  }
}

export class NotAllowedError extends HttpError {
  constructor(message: string = "") {
    super(message, 405);
  }
}
