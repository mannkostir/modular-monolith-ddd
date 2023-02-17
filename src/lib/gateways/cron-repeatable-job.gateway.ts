import { RepeatableJobGateway } from '@lib/gateways/repeatable-job.gateway';
import Redis from 'ioredis';

export class CronRepeatableJobGateway extends RepeatableJobGateway {
  constructor(
    redisConnection: Redis,
    id: string,
    private readonly cronPattern: string,
  ) {
    super(redisConnection, id);
  }

  async run(): Promise<void> {
    await super.run();

    await this.queue.add(
      `${this.queueId}_job`,
      {},
      {
        repeat: { pattern: this.cronPattern },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  }
}
