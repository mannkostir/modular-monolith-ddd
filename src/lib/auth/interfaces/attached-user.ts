import { UserForAuth } from '@lib/auth/interfaces/user-for-auth.type';

export type AttachedUser = Pick<UserForAuth, 'id'>;
