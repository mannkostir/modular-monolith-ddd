import { Controller } from '@src/domains/gateway/base/controller';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { MessageBus } from '@lib/base/communication/message.bus';
import { MessageTokens } from '@lib/types/message-tokens.type';
import { IMessage } from '@lib/types/message.type';

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

  public abstract getMessagePattern(): MessageTokens;

  abstract handle(message: IMessage): Promise<void>;
}
