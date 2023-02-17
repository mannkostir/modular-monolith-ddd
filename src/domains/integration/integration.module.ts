import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DataSource, EntitySchema, EntityTarget } from 'typeorm';
import { MessageBroker } from './message-broker/message-broker';
import { MessageRelay } from './message-relay/message-relay';
import { MessageBus } from './base/message.bus';
import { ProviderTokens } from '@lib/types/provider-tokens.type';
import Redis from 'ioredis';
import { OutboxMessage } from '@src/infrastructure/database/types/outbox-message.type';

interface ModuleData {
  moduleToken: string;
  entityTargetOrSchema:
    | EntityTarget<OutboxMessage>
    | EntitySchema<OutboxMessage>;
  typeormDataSource: DataSource;
  redisConnection: Redis;
}

@Module({})
export class IntegrationModule {
  static init(data: ModuleData): DynamicModule {
    const MessageRelayProvider = {
      useFactory: async (
        messageBroker: MessageBroker,
        options: ModuleData,
        dataSource: DataSource,
        redisConnection: Redis,
      ) => {
        const outboxRepository = dataSource.getRepository(
          options.entityTargetOrSchema,
        );
        //TODO: Remove
        await dataSource.initialize();
        const messageRelay = new MessageRelay(
          outboxRepository,
          redisConnection,
          options.moduleToken,
        );
        messageRelay.attach(messageBroker);
        return messageRelay;
      },
      inject: [
        MessageBroker,
        'INTEGRATION_OPTIONS',
        ProviderTokens.dataSource,
        ProviderTokens.redisConnection,
      ],
      provide: MessageRelay,
    };

    const MessageBusProvider: Provider<MessageBus> = {
      useValue: MessageBus.getInstance(),
      provide: MessageBus,
    };

    const MessageBrokerProvider = {
      useFactory: async (messageBus: MessageBus, redisConnection: Redis) => {
        return MessageBroker.getInstance(messageBus, redisConnection);
      },
      inject: [MessageBus, ProviderTokens.redisConnection],
      provide: MessageBroker,
    };
    return {
      module: IntegrationModule,
      providers: [
        {
          useValue: data,
          provide: 'INTEGRATION_OPTIONS',
        },
        {
          useValue: data.redisConnection,
          provide: ProviderTokens.redisConnection,
        },
        {
          provide: ProviderTokens.dataSource,
          useValue: data.typeormDataSource,
        },
        MessageBusProvider,
        MessageBrokerProvider,
        MessageRelayProvider,
      ],
      exports: [MessageRelayProvider],
    };
  }
}
