import { UuidVOFactory } from '@lib/value-objects/uuid.value-object';
import { PartialBy } from '@lib/types/partial-by.type';
import { ICommand } from '@nestjs/cqrs';

export type CommandProps<Payload extends Record<string, any>> = PartialBy<
  Command<Payload>,
  'correlationId'
>;

export abstract class Command<
  Payload extends Record<string, any> = Record<string, any>,
> implements ICommand
{
  public readonly correlationId: string;
  public readonly payload: Payload;

  constructor(props: CommandProps<Payload>) {
    this.payload = props.payload;
    this.correlationId =
      props.correlationId || new UuidVOFactory().generate().value;
  }
}
