import { DomainException } from '@lib/base/common/domain.exception';
import { DomainExceptionCode } from '@lib/types/domain-exception-code.type';

export class EntityNotFoundDomainError extends DomainException {
  constructor(message?: string) {
    super(DomainExceptionCode.notFound, message || 'Данные не найдены');
  }
}
