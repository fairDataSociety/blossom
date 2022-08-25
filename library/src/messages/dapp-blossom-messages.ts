import { BLOSSOM_API_EVENT, BLOSSOM_API_RESPONSE_EVENT } from '../constants/events'
import { ApiResponse } from '../model/api-response.model'
import { BlossomMessages } from './blossom-messages'

const MESSAGE_TIMEOUT = 30000
/**
 * Object that contains the resolve and reject functions of a promise
 */
class PromiseHandles {
  private timeoutHandle: NodeJS.Timeout | null = null
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private resolveHandle: (data: any) => void,
    private rejectHandle: (error: Error | string) => void,
    onTimeout: (() => void) | null = null,
  ) {
    if (onTimeout) {
      this.timeoutHandle = setTimeout(() => {
        this.clearTimeout()
        onTimeout()
      }, MESSAGE_TIMEOUT)
    }
  }

  private clearTimeout() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle)
      this.timeoutHandle = null
    }
  }

  public resolve(data: unknown) {
    this.clearTimeout()
    this.resolveHandle(data)
  }

  public reject(error: Error | string) {
    this.clearTimeout()
    this.rejectHandle(error)
  }
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

      this.pendingRequests.set(
        requestId,
        new PromiseHandles(resolve, reject, () => {
          this.completeRequest({
            requestId,
            data: null,
            error: new Error('Request timeout'),
          })
        }),
      )

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

  public closeConnection() {
    if (this.listener) {
      document.removeEventListener(BLOSSOM_API_RESPONSE_EVENT, this.listener)
      this.listener = undefined
    }
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

        this.completeRequest(detail)
      }),
    )
  }

  private completeRequest(response: ApiResponse) {
    const { requestId, data, error } = response

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
  }
}
