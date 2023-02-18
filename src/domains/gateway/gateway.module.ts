import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { OrderHttpController } from '@src/domains/gateway/controllers/order.http.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [
    {
      useClass: JwtAuthGuard,
      provide: 'APP_GUARD',
    },
  ],
  controllers: [OrderHttpController],
})
export class GatewayModule {}
