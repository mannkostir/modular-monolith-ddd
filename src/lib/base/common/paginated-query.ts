import { IQuery } from '@nestjs/cqrs';
import { Query } from '../communication/query';
import { PaginationQuery } from '@lib/interfaces/common/pagination-query.interface';

export abstract class PaginatedQuery<
    Params extends Record<string, any> = Record<string, unknown>,
  >
  extends Query<Params & PaginationQuery>
  implements IQuery
{
  public params: (Params & PaginationQuery) | undefined;

  constructor(props: PaginatedQuery<Params & PaginationQuery>) {
    super(props);
  }
}
