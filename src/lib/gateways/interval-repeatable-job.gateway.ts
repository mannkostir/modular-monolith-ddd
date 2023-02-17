import { RepeatableJobGateway } from '@lib/gateways/repeatable-job.gateway';
import Redis from 'ioredis';

export class IntervalRepeatableJobGateway extends RepeatableJobGateway {
  constructor(
    redisConnection: Redis,
    id: string,
    private readonly intervalMs: number,
  ) {
    super(redisConnection, id);
  }
  async run(): Promise<void> {
    await super.run();

    await this.queue.add(
      `${this.queueId}_job`,
      {},
      {
        repeat: { every: this.intervalMs },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  }
}
