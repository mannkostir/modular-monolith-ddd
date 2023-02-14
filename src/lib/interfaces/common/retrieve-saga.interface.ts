import { ISagaState } from '@lib/base/communication/saga';

export interface IRetrieveSaga<State extends ISagaState = ISagaState> {
  getSaga(correlationId: string): Promise<State>;
}
