import { RepeatableJobGateway } from '@lib/gateways/repeatable-job.gateway';
import Redis from 'ioredis';

export interface RecursiveJobOptions {
  rateLimitMs?: number;
}

export class RecursiveRepeatableJobGateway extends RepeatableJobGateway {
  constructor(
    redisConnection: Redis,
    id: string,
    private options: RecursiveJobOptions = {},
  ) {
    super(redisConnection, id);
  }

  async run(): Promise<void> {
    this.worker.on('completed', async () => {
      if (this.options.rateLimitMs) {
        await new Promise((resolve) => {
          setTimeout(resolve, this.options.rateLimitMs);
        });
      }

      await this.queue.add(
        `${this.queueId}_job`,
        {},
        {
          removeOnComplete: true,
          removeOnFail: 100,
        },
      );
    });

    this.worker.on('failed', (job, err) => {
      console.error(err, 'WORKER ERROR');
    });

    await super.run();

    await this.queue.add(
      `${this.queueId}_job`,
      {},
      {
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  }
}
