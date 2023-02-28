import { DAPP_ACTIONS } from '../constants/dapp-actions.enum'
import { BLOSSOM_API_EVENT, BLOSSOM_API_RESPONSE_EVENT } from '../constants/events'
import { isConvertedUint8Array } from '../messaging/message.asserts'
import { ContentPageMessage, MessageResponse, sendMessage } from '../messaging/scripts.messaging'
import { restoreUint8Array } from '../utils/array'
import { isNumber, isBackgroundAction } from '../utils/asserts'

function deserializeResponse(response: unknown): unknown {
  if (isConvertedUint8Array(response)) {
    return restoreUint8Array(response)
  }

  return response
}

/**
 * Utility function that creates a CustomEvent that sends response back to the library
 * @param requestId Request ID sent by the library
 * @param response MessageResponse object that is sent back
 */
function createResponseEvent(requestId: number, response: MessageResponse<unknown>) {
  const event = new CustomEvent(BLOSSOM_API_RESPONSE_EVENT, {
    detail: {
      ...response,
      requestId,
    },
  })

  document.dispatchEvent(event)
}

document.addEventListener(BLOSSOM_API_EVENT, async (event: CustomEventInit<ContentPageMessage<unknown>>) => {
  const { detail } = event

  if (!detail) {
    console.warn('Blossom: Received invalid request from the page')

    return
  }

  const { requestId, action, data } = detail

  if (!isNumber(requestId)) {
    console.warn('Blossom: Invalid request ID')

    return
  }

  if (!isBackgroundAction(action) || !DAPP_ACTIONS.includes(action)) {
    console.warn(`Blossom: Invalid action "${action}"`)

    return
  }

  try {
    const response = await sendMessage<unknown, MessageResponse<unknown>>(action, data)

    createResponseEvent(requestId, { data: deserializeResponse(response) })
  } catch (error) {
    createResponseEvent(requestId, { error })
  }
})
