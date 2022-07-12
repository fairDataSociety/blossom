import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { SwarmExtension } from '../swarm-api/swarm-extension'

export class FdpStorageProvider {
  private fdpStorage: FdpStorage
  private swarmExtension: SwarmExtension = new SwarmExtension(process.env.SWARM_EXTENSION_ID)
  private beeAddress: string
  private beeDebugAddress: string

  public async getService(): Promise<FdpStorage> {
    let { beeApiUrl, beeDebugApiUrl } = (await this.swarmExtension.beeAddress()) || {}
    beeApiUrl = beeApiUrl || 'http://localhost:1633'
    beeDebugApiUrl = beeDebugApiUrl || 'http://localhost:1635'

    if (beeApiUrl !== this.beeAddress || beeDebugApiUrl !== this.beeDebugAddress) {
      this.fdpStorage = new FdpStorage((this.beeAddress = beeApiUrl), (this.beeDebugAddress = beeDebugApiUrl))
    }

    return this.fdpStorage
  }
}
