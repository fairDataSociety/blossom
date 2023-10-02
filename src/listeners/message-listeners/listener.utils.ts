import { DappId } from '../../model/general.types'
import { dappUrlToId } from '../../services/fdp-storage/fdp-storage.utils'
import { Storage } from '../../services/storage/storage.service'
import { SwarmExtension } from '../../swarm-api/swarm-extension'

const storage = new Storage()

export async function getDappId(sender: chrome.runtime.MessageSender): Promise<DappId> {
  const { extensionId } = await storage.getSwarm()
  const swarmExtension = new SwarmExtension(extensionId)

  const { beeApiUrl } = await swarmExtension.beeAddress()

  return dappUrlToId(sender.url, beeApiUrl)
}
