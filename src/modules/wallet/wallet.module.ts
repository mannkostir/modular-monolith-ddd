import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletSchema } from '../../infrastructure/database/schema/wallet.schema';

@Module({
  imports: [TypeOrmModule.forFeature([WalletSchema])],
})
export class WalletModule {}
