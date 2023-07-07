import { ListenerHandler } from '../listeners/message-listeners/message-handler'

export type ListenerInterceptor = (
  handler: ListenerHandler<unknown>,
) => (data: unknown, sender: chrome.runtime.MessageSender) => Promise<unknown>
