import { PaginationQuery } from '@lib/interfaces/common/pagination-query.interface';
import { OrderType } from '@lib/types/order.type';

export interface SortingQuery<SortField extends string = string>
  extends PaginationQuery {
  sort?: SortField;
  order?: OrderType;
}
