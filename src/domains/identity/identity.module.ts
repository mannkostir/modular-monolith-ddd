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
import { CqrsModule } from '@nestjs/cqrs';
import { GetUserQueryHandler } from '@src/domains/identity/queries/user/get-user/get-user.query-handler';
import { GenerateTokenQueryHandler } from '@src/domains/identity/queries/generate-token/generate-token.query-handler';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthStrategy } from '@lib/auth/strategies/jwt-auth.strategy';
import { SignUpHttpController } from '@src/domains/identity/commands/user/sign-up/sign-up.http-controller';
import { GetUserDao } from '@src/domains/identity/queries/user/get-user/get-user.dao';
import { SignInHttpController } from '@src/domains/identity/queries/user/sign-in/sign-in.http-controller';
import { LocalAuthStrategy } from '@lib/auth/strategies/local-auth.strategy';
import { PasswordVO } from '@src/domains/identity/domain/value-objects/password.value-object';
import { GetOneUserForAuthDao } from '@lib/auth/strategies/get-one-user-for-auth.dao';
import { UserForAuth } from '@lib/auth/interfaces/user-for-auth.type';
import { AttachedUser } from '@lib/auth/interfaces/attached-user';

const commandHandlers: Type<CommandHandler<UnitOfWork>>[] = [
  CreateUserCommandHandler,
];

const queryHandlers: Type<QueryHandler>[] = [
  GetUserQueryHandler,
  GenerateTokenQueryHandler,
  GenerateTokenQueryHandler,
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
    TypeOrmModule.forFeature([UserSchema]),
    IntegrationModule.init({
      moduleToken: 'identity',
      entityTargetOrSchema: IdentityOutboxMessageSchema,
      redisConnection: RedisConfig,
      typeormDataSource: TypeormConfig,
    }),
    CqrsModule,
  ],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    {
      provide: JwtService,
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '30d' },
        });
      },
      inject: [ConfigService],
    },
    DataSourceProvider,
    ConfigService,
    DomainEventsBusProvider,
    UnitOfWorkProvider,
    DomainEventsPublisherProvider,
    AsyncDomainEventsBusProvider,
    DomainEventsAsyncPublisherProvider,
    {
      provide: JwtAuthStrategy,
      useFactory: (dataSource: DataSource) => {
        return new JwtAuthStrategy('secret', {
          async getUserById(id: string): Promise<AttachedUser | undefined> {
            const user = await new GetUserDao(dataSource).execute({ id });
            return user && user.id ? { id: user.id } : undefined;
          },
        });
      },
      inject: [DataSource],
    },
    {
      provide: LocalAuthStrategy,
      useFactory: (dataSource: DataSource) => {
        return new LocalAuthStrategy(
          'email',
          {
            async getUserByEmail(
              email: string,
            ): Promise<UserForAuth | undefined> {
              const user = new GetOneUserForAuthDao(dataSource).execute({
                email,
              });
              return user;
            },
          },
          {
            compare(
              decrypted: string,
              encrypted: string,
            ): boolean | Promise<boolean> {
              return new PasswordVO(encrypted).compare(decrypted);
            },
          },
        );
      },
      inject: [DataSource],
    },
  ],
  controllers: [SignUpHttpController, SignInHttpController],
})
export class IdentityModule {}
