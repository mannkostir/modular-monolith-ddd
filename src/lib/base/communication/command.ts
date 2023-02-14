import { ICommand } from '@nestjs/cqrs';
import { UuidVOFactory } from '@lib/value-objects/uuid.value-object';
import { PartialBy } from '@lib/types/partial-by.type';

export type CommandProps<Payload extends Record<string, unknown>> = PartialBy<
  Command<Payload>,
  'correlationId'
>;

export abstract class Command<
  Payload extends Record<string, unknown> = Record<string, unknown>,
> implements ICommand
{
  public readonly correlationId: string;

  constructor(props: CommandProps<Payload>) {
    Object.assign(this, props);
    this.correlationId =
      props.correlationId || new UuidVOFactory().generate().value;
  }
}
