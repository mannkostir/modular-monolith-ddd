import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentSchema } from '../../infrastructure/database/schema/payment.schema';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentSchema])],
})
export class PaymentModule {}
