import { E2E_ACTIONS } from '../constants/dapp-actions.enum'
import { Message } from '../messaging/scripts.messaging'
import { isBackgroundAction } from '../utils/asserts'
import { messageHandler } from './message-listeners'

chrome.runtime.onMessageExternal.addListener((request: Message<unknown>, sender, sendResponse) => {
  const { action } = request || {}

  if (!isBackgroundAction(action) || !E2E_ACTIONS.includes(action)) {
    sendResponse({ error: `Blossom: invalid action received from the extension with ID ${sender.id}` })

    return true
  }

  messageHandler(request, sender, sendResponse)

  return true
})
