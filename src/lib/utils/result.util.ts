import { Exception as DomainException } from '@lib/base/common/exception';

interface Value<T, E extends DomainException> {
  isOk: boolean;
  isErr: boolean;

  mapError<R extends DomainException>(cb: (error: E) => R): Result<T, R>;

  mapValue<R>(cb: (value?: T) => R): Result<R, E>;

  unwrap(): T | undefined;

  safeUnwrap(): T | undefined | E;
}

export class _Err<E extends DomainException> implements Value<never, E> {
  readonly isErr = true as const;
  readonly isOk = false as const;

  constructor(protected error: E) {}

  mapError<R extends DomainException>(cb: (error: E) => R): _Err<R> {
    return new _Err(cb(this.error));
  }

  mapValue(): _Err<E> {
    return this;
  }

  unwrap(): never {
    throw this.error;
  }

  safeUnwrap(): E {
    return this.error;
  }
}

export class _Ok<T> implements Value<T, never> {
  readonly isErr = false as const;
  readonly isOk = true as const;

  constructor(protected value?: T) {}

  safeUnwrap(): T {
    return this.value as T;
  }

  mapError(): _Ok<T> {
    return this;
  }

  mapValue<R>(cb: (value?: T) => R): _Ok<R> {
    return new _Ok(cb(this.value));
  }

  unwrap(): T {
    return this.value as T;
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Result {
  export type Err<E extends DomainException> = _Err<E>;

  export type Ok<T> = _Ok<T>;

  export function ok<T extends void>(): Result<T>;
  export function ok<T>(value: T): Result<T>;
  export function ok<T>(value?: T): Result<T> {
    return new _Ok(value);
  }

  export function fail<E extends DomainException>(error: E): Result<never, E> {
    return new _Err(error);
  }
}

export type Result<T = never, E extends DomainException = never> =
  | Result.Ok<T>
  | Result.Err<E>;
