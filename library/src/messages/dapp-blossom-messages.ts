import { BLOSSOM_API_EVENT, BLOSSOM_API_RESPONSE_EVENT } from '../constants/events'
import { BlossomMessages } from './blossom-messages'

class PromiseHandles<Data> {
  constructor(public resolve: (data: Data) => void, public reject: (error: any) => void) {}
}

export class DappBlossomMessages implements BlossomMessages {
  static webRequestId = 1
  private requests: Map<number, PromiseHandles<any>> = new Map()
  private listener: ((event: any) => void) | undefined

  constructor() {
    this.setListener()
  }

  public sendMessage<Response>(action: string, parameters?: unknown): Promise<Response> {
    return new Promise((resolve, reject) => {
      if (!this.listener) {
        reject(new Error('Connection closed'))
      }
      const requestId = DappBlossomMessages.webRequestId++

      this.requests.set(requestId, new PromiseHandles<Response>(resolve, reject))

      const event = new CustomEvent(BLOSSOM_API_EVENT, {
        detail: {
          requestId,
          action,
          data: parameters,
        },
      })

      document.dispatchEvent(event)
    })
  }

  private setListener() {
    document.addEventListener(
      BLOSSOM_API_RESPONSE_EVENT,
      (this.listener = (event: any) => {
        const { detail } = event

        if (!detail) {
          console.warn('Blossom: Received an invalid event from the extension')
          return
        }

        const { requestId, data, error } = detail

        if (!this.requests.has(requestId)) {
          return
        }

        const promiseHandles = this.requests.get(requestId)

        this.requests.delete(requestId)

        if (error) {
          promiseHandles?.reject(error)
        } else {
          promiseHandles?.resolve(data)
        }
      }),
    )
  }

  closeConnection() {
    if (this.listener) {
      document.removeEventListener(BLOSSOM_API_RESPONSE_EVENT, this.listener)
      this.listener = undefined
    }
  }
}
