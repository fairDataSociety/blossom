import { Message, MessageResponse } from '../../messaging/scripts.messaging'
import auth from './auth.listener'
import locales from './locales.listener'
import account from './account.listener'
import test from './test.listener'

const listenrs = [auth, locales, account, test]

export function messageHandler(
  message: Message<unknown>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: MessageResponse<unknown>) => void,
) {
  setTimeout(() => {
    try {
      const { action, data } = message || {}

      if (!action) {
        sendResponse({ error: 'MessageListener: No action specified' })
      }

      const actionPromise = listenrs
        .map((listener) => listener(action, data))
        .find((promise) => Boolean(promise))

      if (!actionPromise) {
        sendResponse({ error: `MessageListener: No handler registered for action ${action}` })
      }

      actionPromise.then((data) => sendResponse({ data })).catch((error) => sendResponse({ error }))
    } catch (error) {
      sendResponse({ error })
    }
  })
}
