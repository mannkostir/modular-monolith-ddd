import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from '../../infrastructure/database/schema/user.schema';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
})
export class IdentityModule {}
