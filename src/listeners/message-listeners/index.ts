import { Message, MessageResponse } from '../../messaging/scripts.messaging'
import auth from './auth.listener'
import fdpStorage from './fdp-storage.listener'
import locales from './locales.listener'
import account from './account.listener'
import settings from './settings.listener'
import test from './test.listener'
import { isInternalMessage, isOtherExtension } from '../../utils/extension'
import { DAPP_ACTIONS, E2E_ACTIONS } from '../../constants/dapp-actions.enum'
import BackgroundAction from '../../constants/background-actions.enum'

const listenrs = [auth, fdpStorage, locales, account, settings, test]

export function messageHandler(
  message: Message<unknown>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: MessageResponse<unknown>) => void,
) {
  const { action, data } = message || {}

  if (!action) {
    sendResponse({ error: 'MessageListener: No action specified' })

    return false
  }

  if (action.startsWith(BackgroundAction.DIALOG)) {
    // Handled in the Dialog service
    return false
  }

  setTimeout(() => {
    try {
      if (!isInternalMessage(sender)) {
        const allowed = (isOtherExtension(sender) ? E2E_ACTIONS : DAPP_ACTIONS).includes(action)

        if (!allowed) {
          return sendResponse({ error: `Blossom: action is not allowed` })
        }
      }

      const actionPromise = listenrs
        .map((listener) => listener(action, data, sender))
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

  return true
}
