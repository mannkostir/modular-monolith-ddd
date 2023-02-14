import { ExtendedQueryBuilder } from '@src/infrastructure/database/base/extended-typeorm-query-builder';

export interface IHandleMissingParameterSpecificationError {
  handleMissingParameter(
    parameterName: string,
    queryObject: Record<string, unknown>,
    qb: ExtendedQueryBuilder,
  ): void;
}
