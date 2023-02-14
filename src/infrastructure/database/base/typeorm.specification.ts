import { DeepPartial } from 'typeorm';
import { ExtendedQueryBuilder } from '@src/infrastructure/database/base/extended-typeorm-query-builder';
import { IHandleMissingParameterSpecificationError } from '@src/infrastructure/database/interfaces/handle-missing-parameter-specification-error.interface';
import { SpecificationErrorHandlingNullStrategy } from '@src/infrastructure/database/base/specification-error-handling.null-strategy';

export interface SpecificationsOptions {
  paramName?: string;
  alias?: string;
}

export abstract class TypeormSpecification<
  Query extends Record<string, any> = Record<string, any>,
  Options extends SpecificationsOptions = SpecificationsOptions,
> {
  private readonly _errorHandlingStrategy: IHandleMissingParameterSpecificationError;

  constructor(
    protected query: DeepPartial<Query>,
    protected options: Options = {} as Options,
    errorHandlingStrategy?: IHandleMissingParameterSpecificationError,
  ) {
    this._errorHandlingStrategy =
      errorHandlingStrategy || new SpecificationErrorHandlingNullStrategy();
  }

  private _queryBuilder: ExtendedQueryBuilder | undefined;

  public get queryBuilder(): ExtendedQueryBuilder {
    if (!this._queryBuilder) throw new Error('Query builder not attached');
    return this._queryBuilder;
  }

  protected get errorHandlingStrategy(): IHandleMissingParameterSpecificationError {
    return this._errorHandlingStrategy;
  }

  public acceptQueryBuilder(queryBuilder: ExtendedQueryBuilder) {
    this._queryBuilder = queryBuilder;
  }

  abstract execute(): ExtendedQueryBuilder;

  protected getAlias(): string {
    const alias = this.options.alias || this.queryBuilder.alias;
    if (!alias) {
      throw new Error('Alias not specified');
    }
    return alias;
  }

  protected getParamName(postfix: string): string {
    return this.getAlias() + (postfix ? `_${postfix}` : '');
  }
}
