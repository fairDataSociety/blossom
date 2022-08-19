import BackgroundAction from '../../constants/background-actions.enum'
import { isFdpStorageRequest } from '../../messaging/message.asserts'
import { FdpStorageRequest } from '../../model/internal-messages.model'
import { DappPermissions } from '../../model/storage/dapps.model'
import { Dialog } from '../../services/dialog.service'
import { callFdpStorageMethod } from '../../services/fdp-storage/fdp-storage-access'
import { SessionFdpStorageProvider } from '../../services/fdp-storage/session-fdp-storage.provider'
import { Storage } from '../../services/storage/storage.service'
import { createMessageHandler } from './message-handler'

const fdpStorageProvider = new SessionFdpStorageProvider()
const dialogs = new Dialog()
const storage = new Storage()

async function handleFdpStorageRequest(
  { accessor, parameters }: FdpStorageRequest,
  sender: chrome.runtime.MessageSender,
): Promise<unknown> {
  try {
    const fdp = await fdpStorageProvider.getService()

    if (!fdp) {
      throw new Error('Blossom: User is not logged in.')
    }

    const dappUrl = sender.url

    // TODO use ENS name instead of URL
    const dapp = await storage.getDapp(dappUrl)

    if (!dapp) {
      // TODO specify permissions
      const confirmed = await dialogs.ask('DIALOG_CREATE_POD', { url: dappUrl })

      if (!confirmed) {
        throw new Error('Blossom: Access denied')
      }

      // TODO support different types of permission
      await storage.updateDapp(dappUrl, { permissions: [DappPermissions.CREATE_POD] })
    }

    const [property, method] = accessor.split('.')

    return callFdpStorageMethod(fdp, property, method, parameters, dappUrl, dapp)
  } catch (error) {
    console.warn(`Blossom: fdp-storage error `, error)
    throw error
  }
}

const messageHandler = createMessageHandler([
  {
    action: BackgroundAction.FDP_STORAGE,
    assert: isFdpStorageRequest,
    handler: handleFdpStorageRequest,
  },
])

export default messageHandler
