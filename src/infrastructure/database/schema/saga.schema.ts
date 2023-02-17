import { EntitySchemaOptions } from 'typeorm';
import { Saga } from '@src/infrastructure/database/types/saga.type';

export const SagaSchemaOptions: Omit<EntitySchemaOptions<Saga>, 'name'> = {
  columns: {
    id: { type: 'uuid', nullable: false, generated: 'uuid', primary: true },
    state: { type: 'jsonb', nullable: false },
    type: { type: 'text', nullable: false },
    correlationId: { type: 'uuid', nullable: false },
    isCompleted: { type: 'boolean', default: false },
  },
};
