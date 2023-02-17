import { DomainExceptionCode } from '@lib/types/domain-exception-code.type';
import { DomainException } from '@lib/base/common/domain.exception';

export class NotPermittedDomainError extends DomainException {
  code = DomainExceptionCode.notPermitted;

  constructor(message?: string) {
    super(message || 'Операция не разрешена');
  }
}
