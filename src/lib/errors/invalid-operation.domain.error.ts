import { DomainException } from '@lib/base/common/domain.exception';
import { DomainExceptionCode } from '@lib/types/domain-exception-code.type';

export class InvalidOperationDomainError extends DomainException {
  code = DomainExceptionCode.invalidOperation;

  constructor(message?: string) {
    super(message || 'Operation forces domain into an invalid state');
  }
}
