import { Rule } from '@lib/base/common/rule.base';

export abstract class DomainRule<
  Context extends Record<string, any>,
> extends Rule<Context> {
  protected constructor(errorMessage?: string) {
    super(errorMessage || 'Нарушено правило предметной области');
  }
}
