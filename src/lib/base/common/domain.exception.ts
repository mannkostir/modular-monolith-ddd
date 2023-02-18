import { Exception } from '@lib/base/common/exception';
import { DomainExceptionCode } from '@lib/types/domain-exception-code.type';

export abstract class DomainException extends Exception {
  code: DomainExceptionCode;

  constructor(code: DomainExceptionCode, message?: string) {
    super(message);
    this.code = code;
  }
}
