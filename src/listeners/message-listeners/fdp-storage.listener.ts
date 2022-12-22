import { FdpStorage } from '@fairdatasociety/fdp-storage'
import BackgroundAction from '../../constants/background-actions.enum'
import { isFdpStorageRequest } from '../../messaging/message.asserts'
import { DappId } from '../../model/general.types'
import { FdpStorageRequest } from '../../model/internal-messages.model'
import { Dapp, PodActions } from '../../model/storage/dapps.model'
import { MemorySession } from '../../model/storage/session.model'
import { Dialog } from '../../services/dialog.service'
import {
  callFdpStorageMethod,
  getPodNameFromParams,
  isPodBasedMethod,
} from '../../services/fdp-storage/fdp-storage-access'
import { dappUrlToId } from '../../services/fdp-storage/fdp-storage.utils'
import { SessionFdpStorageProvider } from '../../services/fdp-storage/session-fdp-storage.provider'
import { SessionService } from '../../services/session.service'
import { Storage } from '../../services/storage/storage.service'
import { SwarmExtension } from '../../swarm-api/swarm-extension'
import { isPodActionAllowed } from '../../utils/permissions'
import { createMessageHandler } from './message-handler'

const fdpStorageProvider = new SessionFdpStorageProvider()
const dialogs = new Dialog()
const storage = new Storage()
const sessionService = new SessionService()

async function getDappId(sender: chrome.runtime.MessageSender): Promise<DappId> {
  const { extensionId } = await storage.getSwarm()
  const swarmExtension = new SwarmExtension(extensionId)

  const { beeApiUrl } = await swarmExtension.beeAddress()

  return dappUrlToId(sender.url, beeApiUrl)
}

async function handleFullAccessRequest(dappId: DappId, dapp: Dapp, session: MemorySession): Promise<boolean> {
  if (dapp && dapp.fullStorageAccess) {
    return true
  }

  const confirmed = await dialogs.ask('DIALOG_FDP_FULL_ACCESS', { dappId })

  if (!confirmed) {
    return false
  }

  await storage.updateDappBySession(dappId, { fullStorageAccess: true }, session)

  return true
}

async function handlePodBasedMethod(
  dappId: DappId,
  dapp: Dapp,
  session: MemorySession,
  fdp: FdpStorage,
  property: string,
  method: string,
  parameters: unknown[],
): Promise<unknown> {
  const podName = getPodNameFromParams(dappId, method, parameters)

  if (!dapp || !isPodActionAllowed(dapp, podName)) {
    const confirmed = await dialogs.ask('DIALOG_CREATE_POD', { dappId, podName })

    if (!confirmed) {
      throw new Error('Blossom: Access denied')
    }

    await storage.setDappPodPermissionBySession(
      dappId,
      { podName, allowedActions: [PodActions.ALL] },
      session,
    )
  }

  return callFdpStorageMethod(fdp, property, method, parameters, dappId, dapp)
}

function handleFullAccessMethod(
  dappId: DappId,
  dapp: Dapp,
  fdp: FdpStorage,
  property: string,
  method: string,
  parameters: unknown[],
): Promise<unknown> {
  return callFdpStorageMethod(fdp, property, method, parameters, dappId, dapp)
}

async function handleFdpStorageRequest(
  { accessor, parameters }: FdpStorageRequest,
  sender: chrome.runtime.MessageSender,
): Promise<unknown> {
  try {
    const [property, method] = accessor.split('.')

    const [dappId, session] = await Promise.all([getDappId(sender), sessionService.load()])

    const dapp = await storage.getDappBySession(dappId, session)

    if (property === 'personalStorage' && method === 'requestFullAccess') {
      return handleFullAccessRequest(dappId, dapp, session)
    }

    const fdp = await fdpStorageProvider.getService()

    if (!fdp) {
      throw new Error('Blossom: User is not logged in.')
    }

    if (isPodBasedMethod(property, method)) {
      return handlePodBasedMethod(dappId, dapp, session, fdp, property, method, parameters)
    }

    return handleFullAccessMethod(dappId, dapp, fdp, property, method, parameters)
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
