import { User } from './user.type';

export type Wallet = {
  id: string;
  userId: string;
  user?: User;
  balance: number;
};
