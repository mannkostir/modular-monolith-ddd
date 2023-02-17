import { PersistenceException } from '@src/infrastructure/database/errors/persistence.exception';
import { PersistenceExceptionCode } from '@src/infrastructure/database/errors/persistence.exception-code';

export class EntityNotFoundDomainError extends PersistenceException {
  constructor(message?: string) {
    super(
      PersistenceExceptionCode.entityNotFound,
      message || 'Данные не найдены',
    );
  }
}
