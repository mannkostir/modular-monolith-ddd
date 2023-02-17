import { Exception } from '@lib/base/common/exception';
import { PersistenceExceptionCode } from '@src/infrastructure/database/errors/persistence.exception-code';

export class PersistenceException extends Exception {
  public code: PersistenceExceptionCode;

  constructor(code: PersistenceExceptionCode, message?: string) {
    super(message);
    this.code = code;
  }
}
