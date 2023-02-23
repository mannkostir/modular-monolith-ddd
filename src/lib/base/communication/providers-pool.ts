import { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

export class ProvidersPool {
  private providerTokenToPropertyNameMap = new Map<string | Type, symbol>();

  constructor(private readonly moduleRef: ModuleRef) {}

  public getProvider<ProviderType>(token: string | Type): ProviderType {
    let fieldName: symbol;
    if (this.providerTokenToPropertyNameMap.has(token)) {
      fieldName = this.providerTokenToPropertyNameMap.get(token) as symbol;
    } else {
      fieldName = Symbol();
      this.providerTokenToPropertyNameMap.set(token, fieldName);
    }

    if (!this[fieldName]) {
      this[fieldName] = this.moduleRef.get(token);
      if (!this[fieldName])
        throw new Error(`Provider with token "${token}" not provided`);
    }
    return this[fieldName];
  }
}
