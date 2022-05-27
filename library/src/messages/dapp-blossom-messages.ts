import { BLOSSOM_API_EVENT, BLOSSOM_API_RESPONSE_EVENT } from '../constants/events'
import { ApiResponse } from '../model/api-response.model'
import { BlossomMessages } from './blossom-messages'

/**
 * Object that contains the resolve and reject functions of a promise
 */
class PromiseHandles {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public resolve: (data: any) => void, public reject: (error: Error | string) => void) {}
}

export class DappBlossomMessages implements BlossomMessages {
  static webRequestId = 1
  private pendingRequests: Map<number, PromiseHandles> = new Map()
  private listener: ((event: CustomEventInit<ApiResponse>) => void) | undefined

  constructor() {
    this.setListener()
  }

  public sendMessage<Response>(action: string, parameters?: unknown): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      if (!this.listener) {
        reject(new Error('Connection closed'))

        return
      }
      const requestId = DappBlossomMessages.webRequestId++

      this.pendingRequests.set(requestId, new PromiseHandles(resolve, reject))

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
      (this.listener = (event: CustomEventInit<ApiResponse>) => {
        const { detail } = event

        if (!detail) {
          console.warn('Blossom: Received an invalid event from the extension')

          return
        }

        const { requestId, data, error } = detail

        if (!this.pendingRequests.has(requestId)) {
          return
        }

        const promiseHandles = this.pendingRequests.get(requestId)

        this.pendingRequests.delete(requestId)

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
