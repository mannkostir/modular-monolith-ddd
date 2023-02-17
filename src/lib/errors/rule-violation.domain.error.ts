import { DomainExceptionCode } from '@lib/types/domain-exception-code.type';
import { DomainException } from '@lib/base/common/domain.exception';

export class RuleViolatedDomainError extends DomainException {
  code: DomainExceptionCode.ruleViolated = DomainExceptionCode.ruleViolated;

  constructor(message?: string) {
    super(message || 'Нарушено правило предметной области');
  }
}
