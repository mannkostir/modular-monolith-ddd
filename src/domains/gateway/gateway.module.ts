import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  providers: [
    {
      useClass: JwtAuthGuard,
      provide: 'APP_GUARD',
    },
  ],
})
export class GatewayModule {}
