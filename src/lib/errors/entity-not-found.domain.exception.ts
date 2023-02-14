import { Exception } from '@lib/base/common/exception';
import { ExceptionCodes } from '@lib/types/exceptions-codes.type';

export class EntityNotFoundDomainError extends Exception {
  public code: ExceptionCodes;

  constructor(message?: string) {
    super(message || 'Данные не найдены');
    this.code = ExceptionCodes.notFound;
  }
}
