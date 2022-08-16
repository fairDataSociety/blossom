import BackgroundAction from '../../constants/background-actions.enum'
import { FdpStorageRequest } from '../../model/internal-messages.model'
import { SessionFdpStorageProvider } from '../../services/fdp-storage/session-fdp-storage.provider'
import { createMessageHandler } from './message-handler'

const allowedMethods = ['personalStorage.create']

const fdpStorageProvider = new SessionFdpStorageProvider()

async function handleFdpStorageRequest({ accessor, parameters }: FdpStorageRequest): Promise<unknown> {
  try {
    const fdp = await fdpStorageProvider.getService()

    if (!fdp) {
      throw new Error('User is not logged in.')
    }

    const [property, method] = accessor.split('.')

    // TODO add method specific logic and checks
    // TODO check dapp context and privileges

    return fdp[property][method](...parameters)
  } catch (error) {
    console.warn(`Blossom: fdp-storage error `, error)
    throw error
  }
}

function isFdpStorageRequest(data: unknown): data is FdpStorageRequest {
  const { accessor, parameters } = (data || {}) as FdpStorageRequest

  return typeof accessor === 'string' && Array.isArray(parameters) && allowedMethods.includes(accessor)
}

const messageHandler = createMessageHandler([
  {
    action: BackgroundAction.FDP_STORAGE,
    assert: isFdpStorageRequest,
    handler: handleFdpStorageRequest,
  },
])

export default messageHandler
