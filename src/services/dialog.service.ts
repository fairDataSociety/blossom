import BackgroundAction from '../constants/background-actions.enum'
import { Message } from '../messaging/scripts.messaging'
import { DialogQuestion } from '../model/internal-messages.model'

const POPUP_WIDTH = 360
const POPUP_HEIGHT = 360
const POPUP_TIMEOUT = 25000

export class Dialog {
  public ask(question: string, placeholders?: Record<string, string>): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const position = this.getPosition()

        const window = await chrome.windows.create({
          url: 'dialog.html',
          type: 'popup',
          width: POPUP_WIDTH,
          height: POPUP_HEIGHT,
          ...position,
        })

        const messageHandler = this.createDialogMessageHandler(window.id, question, placeholders, resolve)

        chrome.runtime.onMessage.addListener(messageHandler)

        const timeout = setTimeout(() => {
          resolve(false)
          chrome.windows.remove(window.id)
        }, POPUP_TIMEOUT)

        const onRemovedHandler = (windowId: number) => {
          if (windowId === window.id) {
            clearTimeout(timeout)
            chrome.runtime.onMessage.removeListener(messageHandler)
            chrome.windows.onRemoved.removeListener(onRemovedHandler)
          }
        }

        chrome.windows.onRemoved.addListener(onRemovedHandler)
      } catch (error) {
        reject(error)
      }
    })
  }

  private createDialogMessageHandler(
    windowId: number,
    question: string,
    placeholders: Record<string, string>,
    resolve: (answer: boolean) => void,
  ): (
    message: Message<unknown>,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void,
  ) => void {
    return (
      message: Message<unknown>,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: unknown) => void,
    ) => {
      const { action, data } = message || {}

      if (sender.tab?.windowId !== windowId) {
        return
      }

      if (action === BackgroundAction.DIALOG_REQUEST) {
        sendResponse({ data: { question, placeholders } as DialogQuestion })

        return
      }

      if (action === BackgroundAction.DIALOG_RESPONSE) {
        resolve((data as boolean) || false)
        chrome.windows.remove(windowId)
        sendResponse()
      }
    }
  }

  private async getPosition(): Promise<{ top: number; left: number }> {
    try {
      const { top, left } = await chrome.windows.getLastFocused()

      return {
        top,
        left,
      }
    } catch (error) {
      const { screenX, screenY, outerWidth } = window

      return {
        top: Math.max(screenY, 0),
        left: Math.max(screenX + (outerWidth - POPUP_WIDTH), 0),
      }
    }
  }
}
