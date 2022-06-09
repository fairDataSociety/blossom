import BackgroundAction from '../constants/background-actions.enum'

export interface Message<Data> {
  action: BackgroundAction
  data?: Data
}

export interface MessageResponse<Data> {
  error?: Error | string
  data?: Data
}

export interface ContentPageMessage<Data> extends Message<Data> {
  requestId: number
}

/**
 * Sends a message to the service worker script.
 * @param action Service worker script action
 * @param data Arbitrary data
 */
export function sendMessage<Data, Response>(action: BackgroundAction, data?: Data): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    try {
      chrome.runtime.sendMessage<Message<Data>, MessageResponse<Response>>({ action, data }, (response) => {
        const error = chrome.runtime.lastError

        if (error) {
          return reject(new Error(error.message))
        }

        if (response?.error) {
          const responseError = response.error

          return reject(typeof responseError === 'string' ? new Error(responseError) : responseError)
        }

        resolve(response?.data)
      })
    } catch (error) {
      reject(error)
    }
  })
}
