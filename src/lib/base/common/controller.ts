import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export abstract class Controller {
  constructor(
    protected commandBus: CommandBus,
    protected queryBus: QueryBus,
    protected config: ConfigService,
    protected moduleRef: ModuleRef,
  ) {}
}
