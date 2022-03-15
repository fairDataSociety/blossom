import { Message, MessageResponse } from '../../messaging/scripts.messaging'
import auth from './auth.listener'

const listenrs = [auth]

chrome.runtime.onMessage.addListener(
  (
    message: Message<unknown>,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: MessageResponse<unknown>) => void,
  ) => {
    try {
      const { action, data } = message

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

    return true
  },
)
