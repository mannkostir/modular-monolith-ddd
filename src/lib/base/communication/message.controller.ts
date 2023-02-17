import { Controller } from '@src/domains/gateway/base/controller';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { IMessage } from '@lib/types/message.type';
import { MessageBus } from '@src/domains/integration/base/message.bus';

@Injectable()
export abstract class MessageController extends Controller {
  constructor(
    commandBus: CommandBus,
    queryBus: QueryBus,
    configService: ConfigService,
  ) {
    super(commandBus, queryBus, configService);
    MessageBus.getInstance().register(this.getMessagePattern(), this);
  }

  public abstract getMessagePattern(): string;

  abstract handle(message: IMessage): Promise<void>;
}
