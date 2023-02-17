import { PersistenceException } from '@src/infrastructure/database/errors/persistence.exception';
import { PersistenceExceptionCode } from '@src/infrastructure/database/errors/persistence.exception-code';

export class SavingPersistenceException extends PersistenceException {
  constructor(message?: string) {
    super(
      PersistenceExceptionCode.entityNotFound,
      message || 'Ошибка при сохранении данных',
    );
  }
}
