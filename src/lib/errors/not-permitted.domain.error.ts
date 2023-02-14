import { ExceptionCodes } from '@lib/types/exceptions-codes.type';
import { Exception } from '@lib/base/common/exception';

export class NotPermittedDomainError extends Exception {
  code: ExceptionCodes.notPermitted = ExceptionCodes.notPermitted;

  constructor(message?: string) {
    super(message || 'Операция не разрешена');
  }
}
