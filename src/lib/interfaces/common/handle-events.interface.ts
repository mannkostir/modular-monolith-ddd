import { IEvent } from '@lib/base/common/event';
import { Result } from '@lib/utils/result.util';
import { Exception } from '@lib/base/common/exception';

export interface IHandleEvents<Event extends IEvent> {
  handle(event: Event): Promise<Result<unknown, Exception>>;
}
