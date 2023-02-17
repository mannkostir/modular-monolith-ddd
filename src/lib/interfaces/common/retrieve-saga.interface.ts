import { SagaState } from '@src/domains/integration/base/saga';

export interface IRetrieveSaga<State extends SagaState = SagaState> {
  getSaga(correlationId: string): Promise<State | undefined>;
}
