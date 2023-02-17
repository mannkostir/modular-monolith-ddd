import { PartialBy } from '@lib/types/partial-by.type';
import { DateVOFactory } from '@lib/value-objects/date.value-object';
import { UuidVO } from '@lib/value-objects/uuid.value-object';

export interface IEvent<
  Payload extends Record<string, unknown> = Record<string, unknown>,
> {
  aggregateId: string;
  payload: Payload;
  correlationId: string;
  dateOccurred: Date;
  token: string;
}

export type EventProps<Payload extends Record<string, any>> = Omit<
  PartialBy<Event<Payload>, 'correlationId'>,
  'dateOccurred' | 'token' | 'isDomainProcessed' | 'type'
>;

export abstract class Event<Payload extends Record<string, any> = any>
  implements IEvent<Payload>
{
  public readonly aggregateId: string;
  public payload: Payload;
  public correlationId: string;
  public dateOccurred: Date;
  public abstract token: string;

  protected constructor(props: EventProps<Payload>) {
    this.aggregateId = props.aggregateId;
    this.payload = props.payload;
    Object.assign(this.payload, props.payload);
    this.correlationId = props.correlationId || UuidVO.generate().value;
    this.dateOccurred = new DateVOFactory().now.date;
  }
}
