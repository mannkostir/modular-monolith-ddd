import { AttachedUser } from '@lib/auth/interfaces/attached-user';

export interface IGetUserById {
  getUserById(id: string): Promise<AttachedUser | undefined>;
}
