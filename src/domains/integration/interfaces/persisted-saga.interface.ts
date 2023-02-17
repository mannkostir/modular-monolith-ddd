import { SagaState } from '@src/domains/integration/base/saga';

export type PersistedSaga<State extends SagaState> = {
  correlationId: string;
  state: State;
  type: string;
  isCompleted: boolean;
};
