import { EntitySchema } from 'typeorm';
import { SagaSchemaOptions } from '@src/infrastructure/database/schema/saga.schema';

const entityName = 'OrderSaga';

export const OrderSagaSchema = new EntitySchema({
  ...SagaSchemaOptions,
  name: entityName,
});
