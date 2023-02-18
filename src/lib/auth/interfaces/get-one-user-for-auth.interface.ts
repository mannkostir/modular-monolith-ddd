import { UserForAuth } from '@lib/auth/interfaces/user-for-auth.type';

export interface IGetOneUserForAuth {
  getUserByEmail(
    email: string,
  ): (UserForAuth | undefined) | Promise<UserForAuth | undefined>;
}
