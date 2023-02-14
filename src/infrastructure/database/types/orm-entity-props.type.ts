import { DeepPartial } from '@lib/types/deep-partial.type';

export type OrmEntityProps<OrmEntity> = DeepPartial<
  Omit<OrmEntity, 'id' | 'createdAt' | 'updatedAt'>
>;
