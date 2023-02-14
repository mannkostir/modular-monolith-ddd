import { IQuery } from '@nestjs/cqrs';
import { Query } from '../communication/query';
import { SortingQuery } from '@lib/interfaces/common/sorting-query.interface';

export abstract class PaginatedQueryWithSorting<
    Params extends Record<string, any> = Record<string, unknown>,
  >
  extends Query<Params & SortingQuery>
  implements IQuery
{
  public params: (Params & SortingQuery) | undefined;

  constructor(props: PaginatedQueryWithSorting<Params & SortingQuery>) {
    super(props);
  }
}
