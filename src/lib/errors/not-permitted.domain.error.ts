import { DomainException } from '@lib/base/common/domain.exception';
import { DomainExceptionCode } from '@lib/types/domain-exception-code.type';

export class NotPermittedDomainError extends DomainException {
  constructor(message?: string) {
    super(DomainExceptionCode.notPermitted, message || 'Операция не разрешена');
  }
}
