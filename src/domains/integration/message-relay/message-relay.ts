import { ObserverSubject } from '@lib/base/observer.subject.base';
import { Repository } from 'typeorm';
import { RecursiveRepeatableJobGateway } from '@lib/gateways/recursive-repeatable-job.gateway';
import { QueueGateway, QueueJob } from '@lib/gateways/queue.gateway';
import { IMessage } from '@lib/types/message.type';
import { OutboxMessage } from '@src/infrastructure/database/types/outbox-message.type';
import Redis from 'ioredis';
import { OutboxMessageStatus } from '@src/infrastructure/database/types/outbox-message-status.type';
import { OnModuleInit } from '@nestjs/common';

export class MessageRelay
  extends ObserverSubject<IMessage>
  implements OnModuleInit
{
  private queue: QueueGateway<IMessage>;

  constructor(
    private outboxRepository: Repository<OutboxMessage>,
    private redisConnection: Redis,
    private moduleToken: string,
  ) {
    super();
    this.queue = new QueueGateway<IMessage>(
      redisConnection,
      `${moduleToken}_relay`,
    );
    this.queue.addProcessor(async (job: QueueJob<IMessage>) => {
      this.transmit(job.data);
    });
  }

  public async accept(messages: IMessage[]): Promise<void> {
    await this.queue.enqueue(
      messages.map((message) => ({ data: message, name: message.token })),
    );
  }

  onModuleInit(): void {
    const repeatableJob = new RecursiveRepeatableJobGateway(
      this.redisConnection,
      `${this.moduleToken}_events_outbox`,
      { rateLimitMs: 1000 },
    );

    repeatableJob.addProcessor(async () => {
      await this.outboxRepository.manager
        .transaction(async (transactionalEntityManager) => {
          const pendingEvents =
            await transactionalEntityManager.find<OutboxMessage>(
              this.outboxRepository.target,
              {
                where: {
                  status: OutboxMessageStatus.pending,
                },
                take: 10,
              },
            );

          for (const event of pendingEvents) {
            try {
              await this.outboxRepository.save(
                this.outboxRepository.create({
                  ...event,
                  status: OutboxMessageStatus.processed,
                }),
              );

              await this.accept([event]);
            } catch (err) {
              const entity = this.outboxRepository.create({
                ...event,
                status: OutboxMessageStatus.rejected,
              });
              await this.outboxRepository.save<OutboxMessage>(entity);
            }
          }
        })
        .catch(console.error);
    });

    this.queue.run().then(() => {
      repeatableJob.run().catch(console.error);
    });
  }

  private transmit(event: IMessage): void {
    this.notify(event);
  }
}
