import { User } from '../../../../infrastructure/database/types/user.type';

export interface IGetOneUser {
  getUserById(id: string): User;

  getUserByEmail(email: string): User;
}
