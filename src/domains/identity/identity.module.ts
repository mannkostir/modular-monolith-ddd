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
import { IdentityOutboxMessageSchema } from '@src/infrastructure/database/schema/identity.outbox-message.schema';
import { UserSchema } from '@src/infrastructure/database/schema/user.schema';
import { CreateUserCommandHandler } from '@src/domains/identity/commands/user/create-user/create-user.command-handler';
import { UnitOfWork } from '@src/domains/identity/persistence/unit-of-work';

const commandHandlers: Type<CommandHandler<UnitOfWork>>[] = [
  CreateUserCommandHandler,
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
    TypeOrmModule.forFeature([UserSchema]),
    IntegrationModule.init({
      moduleToken: 'identity',
      entityTargetOrSchema: IdentityOutboxMessageSchema,
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
export class IdentityModule {}
