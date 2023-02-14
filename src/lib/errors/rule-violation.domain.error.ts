import { ExceptionCodes } from '@lib/types/exceptions-codes.type';
import { Exception } from '@lib/base/common/exception';

export class RuleViolatedDomainError extends Exception {
  code: ExceptionCodes.ruleViolated = ExceptionCodes.ruleViolated;

  constructor(message?: string) {
    super(message || 'Нарушено правило предметной области');
  }
}
