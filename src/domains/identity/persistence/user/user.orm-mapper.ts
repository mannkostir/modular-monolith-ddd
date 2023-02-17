import { OrmMapper } from '@src/infrastructure/database/base/orm-mapper';
import {
  UserEntity,
  UserProps,
} from '@src/domains/identity/domain/entities/user.entity';
import { User } from '@src/infrastructure/database/types/user.type';
import { OrmEntityProps } from '@src/infrastructure/database/types/orm-entity-props.type';

export class UserOrmMapper extends OrmMapper<UserEntity, UserProps, User> {
  protected getEntityConstructor(ormEntity: User): {
    new (props: any): UserEntity;
  } {
    return UserEntity;
  }

  protected async toDomainProps(ormEntity: User): Promise<UserProps> {
    return { email: ormEntity.email, password: ormEntity.password };
  }

  protected async toOrmProps(
    entity: UserEntity,
  ): Promise<OrmEntityProps<User>> {
    const props = entity.getCopiedProps();

    return {
      email: props.email,
      password: props.password,
    };
  }
}
