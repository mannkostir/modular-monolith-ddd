import { ISagaState } from '@lib/base/communication/saga';

export interface ISaveSaga {
  saveSagaState(correlationId: string, state: ISagaState): Promise<void>;
}
