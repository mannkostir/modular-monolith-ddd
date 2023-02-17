import { OutboxMessageSchemaOptions } from '@src/infrastructure/database/schema/outbox-message.schema';
import { EntitySchema } from 'typeorm';

const entityName = 'IdentityOutbox';

export const IdentityOutboxMessageSchema = new EntitySchema({
  ...OutboxMessageSchemaOptions,
  name: entityName,
});
