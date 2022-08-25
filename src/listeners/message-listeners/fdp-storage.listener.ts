import BackgroundAction from '../../constants/background-actions.enum'
import { isFdpStorageRequest } from '../../messaging/message.asserts'
import { FdpStorageRequest } from '../../model/internal-messages.model'
import { DappPermissions } from '../../model/storage/dapps.model'
import { Dialog } from '../../services/dialog.service'
import { callFdpStorageMethod } from '../../services/fdp-storage/fdp-storage-access'
import { dappUrlToId } from '../../services/fdp-storage/fdp-storage.utils'
import { SessionFdpStorageProvider } from '../../services/fdp-storage/session-fdp-storage.provider'
import { Storage } from '../../services/storage/storage.service'
import { SwarmExtension } from '../../swarm-api/swarm-extension'
import { createMessageHandler } from './message-handler'

const fdpStorageProvider = new SessionFdpStorageProvider()
const dialogs = new Dialog()
const storage = new Storage()

async function handleFdpStorageRequest(
  { accessor, parameters }: FdpStorageRequest,
  sender: chrome.runtime.MessageSender,
): Promise<unknown> {
  try {
    const [fdp, { extensionId }] = await Promise.all([fdpStorageProvider.getService(), storage.getSwarm()])

    if (!fdp) {
      throw new Error('Blossom: User is not logged in.')
    }

    const swarmExtension = new SwarmExtension(extensionId)

    const { beeApiUrl } = await swarmExtension.beeAddress()

    const dappId = dappUrlToId(sender.url, beeApiUrl)

    const dapp = await storage.getDapp(dappId)

    if (!dapp) {
      // TODO specify permissions
      const confirmed = await dialogs.ask('DIALOG_CREATE_POD', { name: dappId })

      if (!confirmed) {
        throw new Error('Blossom: Access denied')
      }

      // TODO support different types of permission
      await storage.updateDapp(dappId, { permissions: [DappPermissions.CREATE_POD] })
    }

    const [property, method] = accessor.split('.')

    return callFdpStorageMethod(fdp, property, method, parameters, dappId, dapp)
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
