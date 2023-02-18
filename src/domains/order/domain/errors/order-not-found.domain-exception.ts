import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';

export class OrderNotFoundDomainException extends EntityNotFoundDomainError {
  constructor() {
    super('Заказ не найден');
  }
}
