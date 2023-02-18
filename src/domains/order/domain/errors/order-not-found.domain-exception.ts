import { DomainException } from '@lib/base/common/domain.exception';
import { DomainExceptionCode } from '@lib/types/domain-exception-code.type';

export class OrderNotFoundDomainException extends DomainException {
  constructor() {
    super(DomainExceptionCode.notFound, 'Заказ не найден');
  }
}
