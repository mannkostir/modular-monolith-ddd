import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { Exception } from '../base/common/exception';
import { EntityNotFoundDomainError } from '@src/infrastructure/database/errors/entity-not-found.persistence.exception';
import { ConflictDomainError } from '@lib/errors/conflict.domain.exception';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { NotPermittedDomainError } from '@lib/errors/not-permitted.domain.error';
import { RuleViolatedDomainError } from '@lib/errors/rule-violation.domain.error';

export class ExceptionInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<Exception> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof EntityNotFoundDomainError) {
          throw new NotFoundException(err.message);
        }
        if (err instanceof ConflictDomainError) {
          throw new ConflictException(err.message);
        }
        if (err instanceof InvalidOperationDomainError) {
          throw new BadRequestException(err.message);
        }
        if (err instanceof NotPermittedDomainError) {
          throw new ForbiddenException(err.message);
        }
        if (err instanceof RuleViolatedDomainError) {
          throw new BadRequestException(err.message);
        }
        return throwError(err);
      }),
    );
  }
}
