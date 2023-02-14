import { Exception } from '@lib/base/common/exception';
import { Result } from '@lib/utils/result.util';

export interface ILogErrors {
  logError(error: Result.Err<Exception>): void | Promise<void>;
}
