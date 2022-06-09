import BackgroundAction from '../../constants/background-actions.enum'
import { Locales } from '../../services/locales.service'
import { createMessageHandler } from './message-handler'

const localesService = new Locales()

export function getLocales() {
  return localesService.getLocales()
}

const messageHandler = createMessageHandler([
  {
    action: BackgroundAction.GET_LOCALES,
    handler: getLocales,
  },
])

export default messageHandler
