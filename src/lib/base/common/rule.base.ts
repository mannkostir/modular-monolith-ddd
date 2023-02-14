import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { Result } from '@lib/utils/result.util';

export abstract class Rule<
  EntityProps extends Record<string, any> = Record<string, any>,
  Context extends Record<string, any> = EntityProps,
> {
  public context: Context | undefined;
  protected readonly errorMessage: string;

  protected constructor(errorMessage?: string) {
    this.errorMessage = errorMessage || 'Нарушено правило';
  }

  execute(): Result<void, InvalidOperationDomainError> {
    if (!this.check()) {
      return Result.fail(new InvalidOperationDomainError(this.errorMessage));
    }
    return Result.ok();
  }

  protected abstract check(): boolean;
}
