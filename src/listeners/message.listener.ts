import { Message, MessageResponse } from '../messaging/scripts.messaging'
import { messageHandler } from './message-listeners'

chrome.runtime.onMessage.addListener(
  (
    message: Message<unknown>,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: MessageResponse<unknown>) => void,
  ) => {
    messageHandler(message, sender, sendResponse)

    return true
  },
)
