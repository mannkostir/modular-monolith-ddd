import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { OrderHttpController } from '@src/domains/gateway/controllers/order.http.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ItemsHttpController } from '@src/domains/gateway/controllers/items.http.controller';
import { UserHttpController } from '@src/domains/gateway/controllers/user.http.controller';
import { AuthHttpController } from '@src/domains/gateway/controllers/auth.http.controller';

@Module({
  imports: [CqrsModule],
  providers: [
    {
      useClass: JwtAuthGuard,
      provide: 'APP_GUARD',
    },
  ],
  controllers: [
    OrderHttpController,
    ItemsHttpController,
    UserHttpController,
    AuthHttpController,
  ],
})
export class GatewayModule {}
