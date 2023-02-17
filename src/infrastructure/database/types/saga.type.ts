import { SagaState } from '@src/domains/integration/base/saga';

export type Saga = {
  id: string;
  state: SagaState;
  correlationId: string;
  type: string;
  isCompleted: boolean;
};
