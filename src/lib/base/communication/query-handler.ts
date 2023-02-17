import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Query } from '@lib/base/communication/query';
import { DataSource } from 'typeorm';
import { ProviderTokens } from '@lib/types/provider-tokens.type';

@Injectable()
export abstract class QueryHandler implements OnModuleInit {
  public constructor(protected readonly moduleRef: ModuleRef) {}

  private _dataSource: DataSource | undefined;

  protected get dataSource(): DataSource {
    if (!this._dataSource) throw new Error('Data Source not assigned');
    return this._dataSource;
  }

  private _configService: ConfigService | undefined;

  protected get configService(): ConfigService {
    if (!this._configService) throw new Error('Config Service not assigned');
    return this._configService;
  }

  abstract handle(query: Query): Promise<unknown> | unknown;

  public execute(query: Query): Promise<unknown> | unknown {
    return this.handle(query);
  }

  onModuleInit() {
    this._configService = this.moduleRef.get(ConfigService);
    this._dataSource = this.moduleRef.get(ProviderTokens.dataSource);
  }
}
