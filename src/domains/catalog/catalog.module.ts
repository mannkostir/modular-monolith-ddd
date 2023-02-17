import { Module, Provider, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemSchema } from '@src/infrastructure/database/schema/item.schema';
import { CommandHandler } from '@lib/base/communication/command-handler';
import { UnitOfWork } from '@src/domains/catalog/persistence/unit-of-work';
import { AddItemToCatalogCommandHandler } from '@src/domains/catalog/commands/item/add-item-to-catalog/add-item-to-catalog.command-handler';
import { QueryHandler } from '@lib/base/communication/query-handler';
import { ProviderTokens } from '@lib/types/provider-tokens.type';
import { DomainEventsPublisher } from '@lib/base/domain/domain-events.publisher';
import { AsyncDomainEventsBus } from '@lib/base/common/async-domain-events-bus';
import { DomainEventsAsyncPublisher } from '@lib/base/domain/domain-events.async.publisher';
import { DomainEventsBus } from '@lib/base/common/domain-events-bus';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const commandHandlers: Type<CommandHandler<UnitOfWork>>[] = [
  AddItemToCatalogCommandHandler,
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

@Module({
  imports: [TypeOrmModule.forFeature([ItemSchema])],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ConfigService,
    DomainEventsBusProvider,
    UnitOfWorkProvider,
    DomainEventsPublisherProvider,
    AsyncDomainEventsBusProvider,
    DomainEventsAsyncPublisherProvider,
  ],
})
export class CatalogModule {}