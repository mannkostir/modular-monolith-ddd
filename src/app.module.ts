import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { GatewayModule } from './modules/gateway/gateway.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
