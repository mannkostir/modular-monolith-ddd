import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new Redis({
  host: configService.get('REDIS_HOST'),
  port: configService.get('REDIS_PORT'),
  password: configService.get('REDIS_PASSWORD'),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
