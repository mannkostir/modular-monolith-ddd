import { Exception } from '@lib/base/common/exception';
import { DomainExceptionCode } from '@lib/types/domain-exception-code.type';

export abstract class DomainException extends Exception {
  abstract code: DomainExceptionCode;
}
