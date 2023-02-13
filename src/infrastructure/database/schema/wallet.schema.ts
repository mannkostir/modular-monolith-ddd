import { EntitySchema } from 'typeorm';
import { Wallet } from '../types/wallet.type';

export const WalletSchema = new EntitySchema<Wallet>({
  columns: {
    id: { type: 'uuid', nullable: false, generated: true, primary: true },
    balance: { type: 'number', nullable: false },
  },
  relations: {
    user: {
      type: 'one-to-one',
      target: 'User',
      joinColumn: true,
    },
  },
  name: 'Wallet',
});
