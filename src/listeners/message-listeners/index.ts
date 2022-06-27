import { Message, MessageResponse } from '../../messaging/scripts.messaging'
import auth from './auth.listener'
import locales from './locales.listener'
import account from './account.listener'
import test from './test.listener'
import { isInternalMessage, isOtherExtension } from '../../utils/extension'
import { DAPP_ACTIONS, E2E_ACTIONS } from '../../constants/dapp-actions.enum'

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
        return sendResponse({ error: 'MessageListener: No action specified' })
      }

      if (!isInternalMessage(sender)) {
        const allowed = (isOtherExtension(sender) ? E2E_ACTIONS : DAPP_ACTIONS).includes(action)

        if (!allowed) {
          return sendResponse({ error: `Blossom: action is not allowed` })
        }
      }

      const actionPromise = listenrs
        .map((listener) => listener(action, data))
        .find((promise) => Boolean(promise))

      if (!actionPromise) {
        return sendResponse({ error: `MessageListener: No handler registered for action ${action}` })
      }

      actionPromise
        .then((data) => sendResponse({ data }))
        .catch((error) => sendResponse({ error: error.toString() }))
    } catch (error) {
      sendResponse({ error })
    }
  })
}
