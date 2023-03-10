export abstract class Exception extends Error {
  constructor(message?: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
