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
import { ConfirmOrderCommandHandler } from '@src/domains/order/commands/order/confirm-order/confirm-order.command-handler';
import { CreateOrderCommandHandler } from '@src/domains/order/commands/order/create-order/create-order.command-handler';
import { CancelOrderCommandHandler } from '@src/domains/order/commands/order/cancel-order/cancel-order.command-handler';
import { PlaceOrderCommandHandler } from '@src/domains/order/commands/order/place-order/place-order.command-handler';
import { GetOrderQueryHandler } from '@src/domains/order/queries/order/get-order/get-order.query-handler';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderItemHttpController } from '@src/domains/order/commands/ordered-item/order-item/order-item.http-controller';
import { ConfirmOrderHttpController } from '@src/domains/order/commands/order/confirm-order/confirm-order.http-controller';
import { CancelOrderHttpController } from '@src/domains/order/commands/order/cancel-order/cancel-order.http-controller';
import { RemoveOrderHttpController } from '@src/domains/order/commands/order/remove-order/remove-order.http-controller';
import { RemoveOrderCommandHandler } from '@src/domains/order/commands/order/remove-order/remove-order.command-handler';
import { Saga } from '@src/domains/integration/base/saga';
import { PlaceOrderSaga } from '@src/domains/order/sagas/place-order.saga';
import { DomainEventMapper } from '@lib/base/domain/domain-event-mapper';
import { PdfReportAttachedEventMapper } from '@src/domains/order/event-mappers/order-confirmed.domain-event.mapper';
import { AsyncDomainEventHandler } from '@lib/base/domain/async-domain-event-handler';
import { RemoveOrderEventHandler } from '@src/domains/order/event-handlers/order-cancelled/remove-order.event-handler';
import { GetOrderHttpController } from '@src/domains/order/queries/order/get-order/get-order.http-controller';

const commandHandlers: Type<CommandHandler<UnitOfWork>>[] = [
  OrderItemCommandHandler,
  ConfirmOrderCommandHandler,
  CreateOrderCommandHandler,
  CancelOrderCommandHandler,
  PlaceOrderCommandHandler,
  RemoveOrderCommandHandler,
];

const queryHandlers: Type<QueryHandler>[] = [GetOrderQueryHandler];

const sagas: Type<Saga>[] = [PlaceOrderSaga];

const eventMappers: Type<DomainEventMapper>[] = [PdfReportAttachedEventMapper];

const eventHandlers: Type<AsyncDomainEventHandler>[] = [
  RemoveOrderEventHandler,
];

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
    CqrsModule,
  ],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...sagas,
    ...eventMappers,
    ...eventHandlers,
    DataSourceProvider,
    ConfigService,
    DomainEventsBusProvider,
    UnitOfWorkProvider,
    DomainEventsPublisherProvider,
    AsyncDomainEventsBusProvider,
    DomainEventsAsyncPublisherProvider,
  ],
  controllers: [
    OrderItemHttpController,
    ConfirmOrderHttpController,
    CancelOrderHttpController,
    RemoveOrderHttpController,
    GetOrderHttpController,
  ],
})
export class OrderModule {}
