import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from '@src/domains/catalog/catalog.module';
import { OrderModule } from '@src/domains/order/order.module';
import { JwtAuthGuard } from '@src/lib/auth/guards/jwt-auth.guard';
import { IdentityModule } from '@src/domains/identity/identity.module';
import { PaymentModule } from '@src/domains/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        migrations: ['dist/infrastructure/database/migrations/*.js'],
        seeds: ['dist/infrastructure/database/seeds/**/*.js'],
        entities: [
          'dist/infrastructure/database/**/*.schema.js',
          'dist/infrastructure/database/**/*.materialized-view.js',
          'dist/infrastructure/database/**/*.view.js',
        ],
        cli: {
          migrationsDir: 'src/infrastructure/database/migrations',
        },
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    CatalogModule,
    OrderModule,
    IdentityModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [
    {
      useClass: JwtAuthGuard,
      provide: 'APP_GUARD',
    },
  ],
})
export class AppModule {}
