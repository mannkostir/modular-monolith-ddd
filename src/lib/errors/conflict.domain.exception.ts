import { DomainExceptionCode } from '@lib/types/domain-exception-code.type';
import { DomainException } from '@lib/base/common/domain.exception';

export class ConflictDomainError extends DomainException {
  constructor(message?: string) {
    super(DomainExceptionCode.conflict, message || 'Conflict error');
  }
}
