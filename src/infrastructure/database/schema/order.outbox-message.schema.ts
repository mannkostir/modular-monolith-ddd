import { OutboxMessageSchemaOptions } from '@src/infrastructure/database/schema/outbox-message.schema';
import { EntitySchema } from 'typeorm';

const entityName = 'OrderOutbox';

export const OrderOutboxMessageSchema = new EntitySchema({
  ...OutboxMessageSchemaOptions,
  name: entityName,
});
