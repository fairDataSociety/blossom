import { Message, MessageResponse } from '../../messaging/scripts.messaging'
import auth from './auth.listener'
import locales from './locales.listener'
import test from './test.listener'

const listenrs = [auth, locales, test]

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
        .map((listener) => listener(action, data, sender))
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
