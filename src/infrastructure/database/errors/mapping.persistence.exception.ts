import { PersistenceExceptionCode } from '@src/infrastructure/database/errors/persistence.exception-code';
import { PersistenceException } from '@src/infrastructure/database/errors/persistence.exception';

export class MappingPersistenceException extends PersistenceException {
  constructor(message?: string) {
    super(
      PersistenceExceptionCode.mappingError,
      message || 'Ошибка при маппинге сущности',
    );
  }
}
