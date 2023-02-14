import { ISaveSaga } from '@lib/interfaces/common/save-saga.interface';
import { IRetrieveSaga } from '@lib/interfaces/common/retrieve-saga.interface';

export interface IProvideSagaRepository {
  getSagaRepository(correlationId: string): ISaveSaga & IRetrieveSaga;
}
