import { EntitySchemaOptions } from 'typeorm';
import { OutboxMessage } from '@src/infrastructure/database/types/outbox-message.type';
import { OutboxMessageStatus } from '@src/infrastructure/database/types/outbox-message-status.type';

export const OutboxMessageSchemaOptions: Omit<
  EntitySchemaOptions<OutboxMessage>,
  'name'
> = {
  columns: {
    id: { type: 'uuid', nullable: false, generated: 'uuid', primary: true },
    status: {
      enum: OutboxMessageStatus,
      nullable: false,
      type: 'enum',
      default: OutboxMessageStatus.pending,
    },
    payload: { type: 'jsonb', nullable: false },
    correlationId: { type: 'uuid', nullable: false },
    context: { type: 'text', nullable: false },
    token: { type: 'text', nullable: false },
    dateOccurred: { type: 'timestamptz', update: false },
  },
};
