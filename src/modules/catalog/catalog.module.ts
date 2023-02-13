import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemSchema } from '../../infrastructure/database/schema/item.schema';

@Module({
  imports: [TypeOrmModule.forFeature([ItemSchema])],
})
export class CatalogModule {}
