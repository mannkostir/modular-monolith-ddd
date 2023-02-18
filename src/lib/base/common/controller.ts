import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export abstract class Controller {
  constructor(
    protected commandBus: CommandBus,
    protected queryBus: QueryBus,
    protected config: ConfigService,
  ) {}
}
