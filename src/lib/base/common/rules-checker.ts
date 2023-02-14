import { Rule as RuleBase } from '@lib/base/common/rule.base';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { Result } from '@lib/utils/result.util';

export abstract class RulesChecker<
  Rule extends RuleBase<Record<string, any>>,
  Context extends Record<string, any> = Record<string, any>,
> {
  constructor(private readonly context: Context) {}

  public checkRules(rules: Rule[]): Result<void, InvalidOperationDomainError> {
    rules.forEach((rule) => this.setContext(rule));
    const rulesCheckingResult = rules.map((rule) => rule.execute());
    const violatedRule = rulesCheckingResult.find((result) => result.isErr);
    return violatedRule || Result.ok();
  }

  private setContext(rule: Rule) {
    rule.context = this.context;
  }
}
