import { Message, MessageResponse } from '../messaging/scripts.messaging'
import { messageHandler } from './message-listeners'

chrome.runtime.onMessage.addListener(
  (
    message: Message<unknown>,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: MessageResponse<unknown>) => void,
  ) => {
    if (sender.id !== chrome.runtime.id) {
      sendResponse({ error: `Blossom: request not allowed.` })

      return false
    }

    messageHandler(message, sender, sendResponse)

    return true
  },
)
