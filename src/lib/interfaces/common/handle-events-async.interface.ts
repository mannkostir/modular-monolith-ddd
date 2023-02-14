import { IEvent } from '@lib/base/common/event';

export interface IHandleEventsAsync<Event extends IEvent> {
  handle(event: Event): Promise<void>;
}
