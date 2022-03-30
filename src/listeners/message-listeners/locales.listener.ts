import BackgroundAction from '../../constants/background-actions.enum'
import { Locales } from '../../services/locales.service'

const localesService = new Locales()

export function getLocales() {
  return localesService.getLocales()
}

export default function handler(
  action: BackgroundAction,
  data: unknown,
  sender: chrome.runtime.MessageSender,
): Promise<unknown> {
  if (action === BackgroundAction.GET_LOCALES) {
    return getLocales()
  }

  return null
}
