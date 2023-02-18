import { EntitySchema } from 'typeorm';
import { User } from '../types/user.type';

export const UserSchema = new EntitySchema<User>({
  columns: {
    id: {
      type: 'uuid',
      nullable: false,
      generated: 'uuid',
      primary: true,
    },
    password: {
      type: 'text',
      nullable: false,
    },
    email: {
      type: 'text',
      nullable: false,
    },
  },
  name: 'User',
});
