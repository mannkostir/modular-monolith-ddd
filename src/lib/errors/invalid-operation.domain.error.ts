import { Exception } from '@lib/base/common/exception';
import { ExceptionCodes } from '@lib/types/exceptions-codes.type';

export class InvalidOperationDomainError extends Exception {
  code: ExceptionCodes = ExceptionCodes.invalidOperation;

  constructor(message?: string) {
    super(message || 'Operation forces domain into an invalid state');
  }
}
