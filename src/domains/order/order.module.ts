import { Module, Provider, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderedItemSchema } from '@src/infrastructure/database/schema/ordered-item.schema';
import { OrderSchema } from '@src/infrastructure/database/schema/order.schema';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { QueryHandler } from '@lib/base/communication/query-handler';
import { DomainEventsBus } from '@lib/base/common/domain-events-bus';
import { ProviderTokens } from '@lib/types/provider-tokens.type';
import { DataSource } from 'typeorm';
import { DomainEventsPublisher } from '@lib/base/domain/domain-events.publisher';
import { AsyncDomainEventsBus } from '@lib/base/common/async-domain-events-bus';
import { DomainEventsAsyncPublisher } from '@lib/base/domain/domain-events.async.publisher';
import TypeormConfig from '@src/config/typeorm.config';
import { ConfigService } from '@nestjs/config';
import { OrderItemCommandHandler } from '@src/domains/order/commands/ordered-item/order-item/order-item.command-handler';
import { UnitOfWork } from '@src/domains/order/persistence/unit-of-work';
import { IntegrationModule } from '@src/domains/integration/integration.module';
import { OrderOutboxMessageSchema } from '@src/infrastructure/database/schema/order.outbox-message.schema';
import RedisConfig from '@src/config/redis.config';

const commandHandlers: Type<CommandHandler<UnitOfWork>>[] = [
  OrderItemCommandHandler,
];

const queryHandlers: Type<QueryHandler>[] = [];

const DomainEventsBusProvider: Provider<DomainEventsBus> = {
  provide: ProviderTokens.domainEventsBus,
  useFactory: () => {
    return new DomainEventsBus();
  },
};
const UnitOfWorkProvider: Provider<UnitOfWork> = {
  provide: ProviderTokens.unitOfWork,
  useFactory: (dataSource: DataSource) => {
    return new UnitOfWork(dataSource);
  },
  inject: [DataSource],
};
const DomainEventsPublisherProvider: Provider<DomainEventsPublisher> = {
  provide: ProviderTokens.domainEventsPublisher,
  useFactory: (domainEventsBus: DomainEventsBus) => {
    return new DomainEventsPublisher(domainEventsBus);
  },
  inject: [ProviderTokens.domainEventsBus],
};

const AsyncDomainEventsBusProvider: Provider<AsyncDomainEventsBus> = {
  provide: ProviderTokens.domainEventsAsyncBus,
  useFactory: () => {
    return new AsyncDomainEventsBus();
  },
};

const DomainEventsAsyncPublisherProvider: Provider<DomainEventsAsyncPublisher> =
  {
    provide: ProviderTokens.asyncDomainEventsPublisher,
    useFactory: (asyncEventBus: AsyncDomainEventsBus) => {
      return new DomainEventsAsyncPublisher(asyncEventBus);
    },
    inject: [ProviderTokens.domainEventsAsyncBus],
  };

const DataSourceProvider: Provider<DataSource> = {
  provide: ProviderTokens.dataSource,
  useValue: TypeormConfig,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderedItemSchema, OrderSchema]),
    IntegrationModule.init({
      moduleToken: 'order',
      entityTargetOrSchema: OrderOutboxMessageSchema,
      redisConnection: RedisConfig,
      typeormDataSource: TypeormConfig,
    }),
  ],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    DataSourceProvider,
    ConfigService,
    DomainEventsBusProvider,
    UnitOfWorkProvider,
    DomainEventsPublisherProvider,
    AsyncDomainEventsBusProvider,
    DomainEventsAsyncPublisherProvider,
  ],
})
export class OrderModule {}
