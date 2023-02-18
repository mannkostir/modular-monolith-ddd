import { AggregateRoot } from '@lib/base/domain/aggregate-root';
import { PasswordVO } from '@src/domains/identity/domain/value-objects/password.value-object';
import { EmailVO } from '@lib/value-objects/email.value-object';

export type UserProps = {
  email: EmailVO;
  password: PasswordVO;
};

export type CreateUserProps = UserProps;

export class UserEntity extends AggregateRoot<UserProps> {
  public static create(createProps: CreateUserProps): UserEntity {
    return new UserEntity({ props: createProps });
  }
}
