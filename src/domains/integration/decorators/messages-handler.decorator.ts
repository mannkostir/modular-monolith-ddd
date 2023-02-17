import { MessageBus } from '@src/domains/integration/base/message.bus';

export function MessagesHandler(...messageTokens: string[]) {
  return (target) => {
    for (const messageToken of messageTokens) {
      MessageBus.getInstance().register(messageToken, target);
    }
    return target;
  };
}
