import { User } from './user.type';

export interface IGetOneUser {
  getUserById(id: string): User;

  getUserByEmail(email: string): User;
}
