import { Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IUnitOfWork } from '@lib/interfaces/ports/unit-of-work.interface';
import { IHandleMessage } from '@lib/interfaces/common/handle-message.interface';
import { ProviderTokens } from '@lib/types/provider-tokens.type';
import { ITransactionalOutboxRepository } from '@lib/interfaces/ports/transactional-outbox.repository.interface';
import { ISaveSaga } from '@lib/interfaces/common/save-saga.interface';
import { IMessage } from '@lib/types/message.type';
import { Result } from '@lib/utils/result.util';
import { InvalidOperationDomainError } from '@lib/errors/invalid-operation.domain.error';
import { Command } from '@lib/base/communication/command';
import { Query } from '@lib/base/communication/query';
import { MessageBus } from '@src/domains/integration/base/message.bus';
import { IRetrieveSaga } from '@lib/interfaces/common/retrieve-saga.interface';
import { UuidVO } from '@lib/value-objects/uuid.value-object';

export type SagaState = {
  isCompleted: boolean;
  startWithMessage: string;
};

@Injectable()
export abstract class Saga<Data extends SagaState = SagaState>
  implements IHandleMessage
{
  private correlationToStateMap: Map<string, Data> = new Map();

  constructor(
    @Inject(ProviderTokens.unitOfWork)
    private readonly unitOfWork: IUnitOfWork,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {
    for (const message of this.listenToMessages()) {
      MessageBus.getInstance().register(message, this);
    }
  }

  public getOutboxRepository(): ITransactionalOutboxRepository {
    return this.unitOfWork.getTransactionalOutboxRepository();
  }

  public getSagaRepository(correlationId: string): ISaveSaga & IRetrieveSaga {
    return this.unitOfWork.getSagaRepository(correlationId);
  }

  public async handle(message: IMessage) {
    const correlationId = UuidVO.generate().value;

    await this.unitOfWork.execute(correlationId, async () => {
      let sagaState: Data | undefined;

      sagaState = await this.getPersistedState(
        correlationId,
        message.correlationId,
      );
      if (!sagaState) {
        const defaultState = this.getDefaultState();
        if (message.token === defaultState.startWithMessage) {
          sagaState = defaultState;
        } else {
          return Result.fail(
            new InvalidOperationDomainError(
              `Started saga does not found for correlation ${message.correlationId}`,
            ),
          );
        }
      }

      this.updateState(message.correlationId, sagaState);

      await this.execute(message);

      await this.getSagaRepository(correlationId).saveSagaState(
        message.correlationId,
        (await this.getPersistedState(correlationId, message.correlationId)) ||
          this.getDefaultState(),
      );

      this.correlationToStateMap.delete(message.correlationId);

      return Result.ok();
    });
  }

  abstract execute(message: IMessage): Promise<void>;

  protected abstract getDefaultState(): Data;

  protected abstract listenToMessages(): string[];

  protected async sendMessage(message: IMessage): Promise<void> {
    await this.getOutboxRepository().add([message]);
  }

  protected async sendLocalCommand<CommandResult extends Result<unknown>>(
    command: Command,
  ): Promise<CommandResult> {
    return this.commandBus.execute(command);
  }

  protected async sendLocalQuery<QueryResult>(
    query: Query,
  ): Promise<QueryResult> {
    return this.queryBus.execute(query);
  }

  protected updateState(correlationId: string, state: Partial<Data>): void {
    const previousState =
      this.getState(correlationId) || this.getDefaultState();
    this.correlationToStateMap.set(correlationId, {
      ...previousState,
      ...state,
    });
  }

  protected getState(correlationId: string): Data | undefined {
    return this.correlationToStateMap.get(correlationId);
  }

  protected completeSaga(correlationId: string) {
    const state: Partial<Data> = { isCompleted: true } as Partial<Data>;
    this.updateState(correlationId, state);
  }

  private async getPersistedState(
    unitOfWorkCorrelationId: string,
    sagaCorrelationId: string,
  ): Promise<Data | undefined> {
    return (
      this.getState(sagaCorrelationId) ||
      ((await this.getSagaRepository(unitOfWorkCorrelationId).getSaga(
        sagaCorrelationId,
      )) as Data)
    );
  }
}
