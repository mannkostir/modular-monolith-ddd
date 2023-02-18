import { DomainExceptionCode } from '@lib/types/domain-exception-code.type';
import { DomainException } from '@lib/base/common/domain.exception';

export class RuleViolatedDomainError extends DomainException {
  constructor(message?: string) {
    super(
      DomainExceptionCode.ruleViolated,
      message || 'Нарушено правило предметной области',
    );
  }
}
