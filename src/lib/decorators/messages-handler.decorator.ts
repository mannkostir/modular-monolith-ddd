import { MessageTokens } from '@lib/types/message-tokens.type';
import { MessageBus } from '@lib/base/communication/message.bus';

export function MessagesHandler(...messages: MessageTokens[]) {
  return (target) => {
    for (const message of messages) {
      MessageBus.getInstance().register(message, target);
    }
    return target;
  };
}
