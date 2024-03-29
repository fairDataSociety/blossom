import { DappId } from '../model/general.types'
import { SwarmExtension } from '../swarm-api/swarm-extension'
import { isOtherExtension } from '../utils/extension'
import { dappUrlToId } from './fdp-storage/fdp-storage.utils'
import { Storage } from './storage/storage.service'

export class DappService {
  private storage = new Storage()

  public async getDappId(dappUrl: string): Promise<DappId> {
    const { extensionId } = await this.storage.getSwarm()

    const swarmExtension = new SwarmExtension(extensionId)

    const { beeApiUrl } = await swarmExtension.beeAddress()

    return dappUrlToId(dappUrl, beeApiUrl)
  }

  public getDappIdFromSender(sender: chrome.runtime.MessageSender): Promise<DappId> {
    return isOtherExtension(sender) ? Promise.resolve(sender.id) : this.getDappId(sender.url)
  }
}
