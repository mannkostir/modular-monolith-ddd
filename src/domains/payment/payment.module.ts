import { Module, Provider, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { IntegrationModule } from '@src/domains/integration/integration.module';
import RedisConfig from '@src/config/redis.config';
import { PaymentSchema } from '@src/infrastructure/database/schema/payment.schema';
import { PaymentOutboxMessageSchema } from '@src/infrastructure/database/schema/payment.outbox-message.schema';
import { MakePaymentCommandHandler } from '@src/domains/payment/commands/payment/make-payment/make-payment.command-handler';
import { UnitOfWork } from '@src/domains/payment/persistence/unit-of-work';
import { CreatePaymentCommandHandler } from '@src/domains/payment/commands/payment/create-payment/create-payment.command-handler';
import { CqrsModule } from '@nestjs/cqrs';
import { DomainEventMapper } from '@lib/base/domain/domain-event-mapper';
import { PaymentFulfilledEventMapper } from '@src/domains/payment/event-mappers/payment-fulfilled.event-mapper';
import { PaymentRejectedEventMapper } from '@src/domains/payment/event-mappers/payment-rejected.event-mapper';
import { MessageController } from '@lib/base/communication/message.controller';
import { MakePaymentMessageController } from '@src/domains/payment/commands/payment/make-payment/make-payment.message-controller';

const commandHandlers: Type<CommandHandler<UnitOfWork>>[] = [
  MakePaymentCommandHandler,
  CreatePaymentCommandHandler,
];

const queryHandlers: Type<QueryHandler>[] = [];

const eventMappers: Type<DomainEventMapper>[] = [
  PaymentFulfilledEventMapper,
  PaymentRejectedEventMapper,
];

const messageControllers: Type<MessageController>[] = [
  MakePaymentMessageController,
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
    TypeOrmModule.forFeature([PaymentSchema]),
    IntegrationModule.init({
      moduleToken: 'payment',
      entityTargetOrSchema: PaymentOutboxMessageSchema,
      redisConnection: RedisConfig,
      typeormDataSource: TypeormConfig,
    }),
    CqrsModule,
  ],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...eventMappers,
    ...messageControllers,
    DataSourceProvider,
    ConfigService,
    DomainEventsBusProvider,
    UnitOfWorkProvider,
    DomainEventsPublisherProvider,
    AsyncDomainEventsBusProvider,
    DomainEventsAsyncPublisherProvider,
  ],
})
export class PaymentModule {}
