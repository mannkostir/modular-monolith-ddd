import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { GatewayModule } from '@src/domains/gateway/gateway.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from '@src/domains/catalog/catalog.module';
import { OrderModule } from '@src/domains/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GatewayModule,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
