import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderedItemSchema } from '../../infrastructure/database/schema/ordered-item.schema';
import { OrderSchema } from '../../infrastructure/database/schema/order.schema';

@Module({
  imports: [TypeOrmModule.forFeature([OrderedItemSchema, OrderSchema])],
})
export class OrderModule {}
