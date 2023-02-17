import { Repository } from 'typeorm';
import { SagaState } from '@src/domains/integration/base/saga';
import { ISaveSaga } from '@lib/interfaces/common/save-saga.interface';
import { PersistedSaga } from '@src/domains/integration/interfaces/persisted-saga.interface';
import { IRetrieveSaga } from '@lib/interfaces/common/retrieve-saga.interface';

export class SagaRepository<State extends SagaState>
  implements ISaveSaga, IRetrieveSaga
{
  constructor(private repository: Repository<PersistedSaga<State>>) {}

  async getSaga(correlationId: string): Promise<State | undefined> {
    const persistedSaga = await this.repository.findOne({
      where: { correlationId },
    });

    if (!persistedSaga) return undefined;

    return persistedSaga.state as State;
  }

  async saveSagaState(correlationId: string, state: State): Promise<void> {
    const { isCompleted, startWithMessage, ...stateToPersist } = state;

    const serializedSaga: PersistedSaga<State> = {
      correlationId: correlationId,
      state: stateToPersist as State,
      type: startWithMessage,
      isCompleted: isCompleted,
    };

    await this.repository.save(serializedSaga);
  }
}
