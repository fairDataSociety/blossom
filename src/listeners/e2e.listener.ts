import { Message } from '../messaging/scripts.messaging'
import { messageHandler } from './message-listeners'

chrome.runtime.onMessageExternal.addListener((request: Message<unknown>, sender, sendResponse) => {
  messageHandler(request, sender, sendResponse)

  return true
})
