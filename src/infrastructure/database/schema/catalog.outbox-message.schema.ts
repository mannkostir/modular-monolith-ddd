import { OutboxMessageSchemaOptions } from '@src/infrastructure/database/schema/outbox-message.schema';
import { EntitySchema } from 'typeorm';

const entityName = 'CatalogOutbox';

export const CatalogOutboxMessageSchema = new EntitySchema({
  ...OutboxMessageSchemaOptions,
  name: entityName,
});
