import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Query } from '@lib/base/communication/query';
import { DataSource } from 'typeorm';
import { ProviderTokens } from '@lib/types/provider-tokens.type';
import { ProvidersPool } from '@lib/base/communication/providers-pool';
import { Exception } from '@lib/base/common/exception';
import { Result } from '@lib/utils/result.util';

@Injectable()
export abstract class QueryHandler<
  TReturnType = any,
  TExceptionType extends Exception = Exception,
> {
  private readonly providersPool: ProvidersPool;

  public constructor(protected readonly moduleRef: ModuleRef) {
    this.providersPool = new ProvidersPool(moduleRef);
  }

  protected get dataSource(): DataSource {
    return this.providersPool.getProvider(ProviderTokens.dataSource);
  }

  protected get configService(): ConfigService {
    return this.providersPool.getProvider(ConfigService);
  }

  protected abstract handle(
    query: Query,
  ): Promise<Result<TReturnType, TExceptionType>>;

  public execute(query: Query): Promise<Result<TReturnType, TExceptionType>> {
    return this.handle(query);
  }
}
