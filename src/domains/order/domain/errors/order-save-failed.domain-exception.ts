import { DomainException } from '@lib/base/common/domain.exception';
import { DomainExceptionCode } from '@lib/types/domain-exception-code.type';

export class OrderSaveFailedDomainException extends DomainException {
  constructor() {
    super(DomainExceptionCode.invalidOperation, 'Не удалось сохранить заказ');
  }
}
