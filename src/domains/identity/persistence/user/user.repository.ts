import { TypeormRepository } from '@src/infrastructure/database/base/typeorm.repository';
import {
  UserEntity,
  UserProps,
} from '@src/domains/identity/domain/entities/user.entity';
import { User } from '@src/infrastructure/database/types/user.type';
import { Repository } from 'typeorm';
import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { UserOrmMapper } from '@src/domains/identity/persistence/user/user.orm-mapper';

export class UserRepository extends TypeormRepository<
  UserEntity,
  UserProps,
  User
> {
  constructor(
    repository: Repository<User>,
    unitOfWork: TypeormUnitOfWork,
    correlationId: string,
  ) {
    super(repository, new UserOrmMapper(), unitOfWork, correlationId);
  }
}
