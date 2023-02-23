import { Controller } from '@lib/base/common/controller';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { IMessage } from '@lib/types/message.type';
import { MessageBus } from '@src/domains/integration/base/message.bus';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export abstract class MessageController extends Controller {
  constructor(
    commandBus: CommandBus,
    queryBus: QueryBus,
    configService: ConfigService,
    moduleRef: ModuleRef,
  ) {
    super(commandBus, queryBus, configService, moduleRef);
    MessageBus.getInstance().register(this.getMessagePattern(), this);
  }

  public abstract getMessagePattern(): string;

  abstract handle(message: IMessage): Promise<void>;
}
