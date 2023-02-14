import { PaginationMeta } from '@lib/interfaces/common/pagination-meta.type';

export type PaginatedResponseType<T> = PaginationMeta & {
  data: T[];
};
