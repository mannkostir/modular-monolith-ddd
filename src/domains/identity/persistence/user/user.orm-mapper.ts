import { OrmMapper } from '@src/infrastructure/database/base/orm-mapper';
import {
  UserEntity,
  UserProps,
} from '@src/domains/identity/domain/entities/user.entity';
import { User } from '@src/infrastructure/database/types/user.type';
import { OrmEntityProps } from '@src/infrastructure/database/types/orm-entity-props.type';
import { EmailVO } from '@lib/value-objects/email.value-object';
import { PasswordVO } from '@src/domains/identity/domain/value-objects/password.value-object';

export class UserOrmMapper extends OrmMapper<UserEntity, UserProps, User> {
  protected getEntityConstructor(ormEntity: User): {
    new (props: any): UserEntity;
  } {
    return UserEntity;
  }

  protected async toDomainProps(ormEntity: User): Promise<UserProps> {
    return {
      email: new EmailVO(ormEntity.email),
      password: new PasswordVO(ormEntity.password),
    };
  }

  protected async toOrmProps(
    entity: UserEntity,
  ): Promise<OrmEntityProps<User>> {
    const props = entity.getCopiedProps();

    return {
      email: props.email.value,
      password: props.password.value,
    };
  }
}
