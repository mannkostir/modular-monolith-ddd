import { Column, Entity, PrimaryColumn } from 'typeorm';
import { PersistedSaga } from '@src/domains/integration/interfaces/persisted-saga.interface';
import { SagaState } from '@src/domains/integration/base/saga';

const tableName = 'sagas';

@Entity({ name: tableName })
export class SagaOrmEntity implements PersistedSaga<SagaState> {
  @PrimaryColumn('uuid')
  correlationId!: string;
  @Column({ type: 'text', nullable: false })
  type!: string;
  @Column({ type: 'jsonb', nullable: false })
  state!: SagaState;
  @Column({ type: 'boolean', nullable: false })
  isCompleted!: boolean;
}
