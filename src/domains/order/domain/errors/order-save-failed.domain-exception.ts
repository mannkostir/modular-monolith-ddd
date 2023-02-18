import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';

export class OrderSaveFailedDomainException extends InvalidOperationDomainError {
  constructor() {
    super('Не удалось сохранить заказ');
  }
}
