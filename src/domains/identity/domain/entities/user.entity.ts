import { AggregateRoot } from '@lib/base/domain/aggregate-root';

export type UserProps = {
  email: string;
  password: string;
};

export type CreateUserProps = UserProps;

export class UserEntity extends AggregateRoot<UserProps> {
  public static create(createProps: CreateUserProps): UserEntity {
    return new UserEntity({ props: createProps });
  }
}
