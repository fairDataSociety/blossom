import BackgroundAction from '../../constants/background-actions.enum'
import { Errors } from '../../services/error.service'
import { createMessageHandler } from './message-handler'

const errors = new Errors()

export async function getLastError(): Promise<string> {
  const errorMessage = await errors.getMostImportantMessage()

  return errorMessage
}

const messageHandler = createMessageHandler([
  {
    action: BackgroundAction.GET_ERROR,
    handler: getLastError,
  },
])

export default messageHandler
