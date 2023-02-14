import { RulesChecker } from '@lib/base/common/rules-checker';
import { DomainRule } from '@lib/base/domain/domain.rule';

export class DomainRulesChecker extends RulesChecker<
  DomainRule<Record<string, unknown>>
> {}
