import { Module, Provider, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemSchema } from '@src/infrastructure/database/schema/item.schema';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { UnitOfWork } from '@src/domains/catalog/persistence/unit-of-work';
import { QueryHandler } from '@lib/base/communication/query-handler';
import { ProviderTokens } from '@lib/types/provider-tokens.type';
import { DomainEventsPublisher } from '@lib/base/domain/domain-events.publisher';
import { AsyncDomainEventsBus } from '@lib/base/common/async-domain-events-bus';
import { DomainEventsAsyncPublisher } from '@lib/base/domain/domain-events.async.publisher';
import { DomainEventsBus } from '@lib/base/common/domain-events-bus';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GetManyItemsQueryHandler } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.query-handler';
import TypeormConfig from '@src/config/typeorm.config';
import { RemoveItemFromCatalogCommandHandler } from '@src/domains/catalog/commands/item/remove-item-from-catalog/remove-item-from-catalog.command-handler';
import { IntegrationModule } from '@src/domains/integration/integration.module';
import RedisConfig from '@src/config/redis.config';
import { CatalogOutboxMessageSchema } from '@src/infrastructure/database/schema/catalog.outbox-message.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { AddItemToCatalogHttpController } from '@src/domains/catalog/commands/item/add-item-to-catalog/add-item-to-catalog.http-controller';
import { GetManyItemsHttpController } from '@src/domains/catalog/queries/item/get-many-items/get-many-items.http-controller';

const commandHandlers: Type<CommandHandler<UnitOfWork>>[] = [
  RemoveItemFromCatalogCommandHandler,
];

const queryHandlers: Type<QueryHandler>[] = [GetManyItemsQueryHandler];

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
    TypeOrmModule.forFeature([ItemSchema]),
    IntegrationModule.init({
      moduleToken: 'catalog',
      entityTargetOrSchema: CatalogOutboxMessageSchema,
      redisConnection: RedisConfig,
      typeormDataSource: TypeormConfig,
    }),
    CqrsModule,
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
  controllers: [AddItemToCatalogHttpController, GetManyItemsHttpController],
})
export class CatalogModule {}
