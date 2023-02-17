import { MessageBus } from '../base/message.bus';
import { IObserver } from '@lib/interfaces/common/observer.interface';
import { IMessage } from '@lib/types/message.type';
import { QueueGateway, QueueJob } from '@lib/gateways/queue.gateway';
import Redis from 'ioredis';

export class MessageBroker implements IObserver<IMessage> {
  private static instance: MessageBroker | undefined;
  private contextToQueueMap: Map<string, QueueGateway<IMessage>> = new Map();

  private constructor(
    private readonly messageBus: MessageBus,
    private readonly redisConnection: Redis,
  ) {}

  public static getInstance(
    messageBus: MessageBus,
    redisConnection: Redis,
  ): MessageBroker {
    if (!this.instance) {
      this.instance = new MessageBroker(messageBus, redisConnection);
    }
    return this.instance;
  }

  public async update(message: IMessage) {
    let queue: QueueGateway<IMessage> | undefined = this.contextToQueueMap.get(
      message.context,
    );

    if (!queue) {
      const newQueue = new QueueGateway<IMessage>(
        this.redisConnection,
        `message_broker_${message.context}`,
      );

      newQueue.addProcessor(async (job: QueueJob<IMessage>) => {
        this.messageBus.publish(job.data);
      });
      await newQueue.run();

      queue = newQueue;

      this.contextToQueueMap.set(message.context, queue);
    }

    await queue.enqueue([{ data: message, name: message.token }]);
  }
}
