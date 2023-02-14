import { Exception } from '@lib/base/common/exception';
import { ExceptionCodes } from '@lib/types/exceptions-codes.type';

export class ConflictDomainError extends Exception {
  public code: ExceptionCodes.conflict;

  constructor(message?: string) {
    super(message || 'Conflict error');
    this.code = ExceptionCodes.conflict;
  }
}
