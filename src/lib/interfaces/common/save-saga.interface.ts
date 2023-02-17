import { SagaState } from '@src/domains/integration/base/saga';

export interface ISaveSaga {
  saveSagaState(correlationId: string, state: SagaState): Promise<void>;
}
