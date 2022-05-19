import { DAPP_ACTIONS } from '../constants/dapp-actions.enum'
import { BLOSSOM_API_EVENT, BLOSSOM_API_RESPONSE_EVENT } from '../constants/events'
import { MessageResponse, sendMessage } from '../messaging/scripts.messaging'
import { isNumber, isBackgroundAction } from '../utils/asserts'

function createResponseEvent(requestId: number, response: MessageResponse<unknown>) {
  const event = new CustomEvent(BLOSSOM_API_RESPONSE_EVENT, {
    detail: {
      ...response,
      requestId,
    },
  })

  document.dispatchEvent(event)
}

document.addEventListener(BLOSSOM_API_EVENT, async (event: any) => {
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
    console.warn('Blossom: Invalid action')

    return
  }

  try {
    const response = await sendMessage<unknown, MessageResponse<unknown>>(action, data)

    createResponseEvent(requestId, response)
  } catch (error) {
    createResponseEvent(requestId, { error })
  }
})
