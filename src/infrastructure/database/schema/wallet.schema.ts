import { EntitySchema } from 'typeorm';
import { Wallet } from '../types/wallet.type';

export const WalletSchema = new EntitySchema<Wallet>({
  columns: {
    id: { type: 'uuid', nullable: false, generated: 'uuid', primary: true },
    balance: { type: 'int', nullable: false },
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
