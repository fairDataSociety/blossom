import { isServiceWorkerEnv, isWebPageEnv } from '../utils/environment.util'
import { BlossomMessages } from './blossom-messages'
import { DappBlossomMessages } from './dapp-blossom-messages'
import { E2EBlossomMessages } from './e2e-blossom-messages'

export function createBlossomMessages(extensionId: string): BlossomMessages {
  if (isServiceWorkerEnv()) {
    return new E2EBlossomMessages(extensionId)
  } else if (isWebPageEnv()) {
    return new DappBlossomMessages()
  }
  throw new Error('Blossom: The current environment is not supported.')
}
