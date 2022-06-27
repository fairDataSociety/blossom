import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { SwarmExtension } from '../swarm-api/swarm-extension'

export class FdpStorageProvider {
  private fdpStorage: FdpStorage
  private swarmExtension: SwarmExtension = new SwarmExtension(process.env.SWARM_EXTENSION_ID)
  private beeAddress: string
  private beeDebugAddress: string
  private swarmExtensionId: string

  public async getService(): Promise<FdpStorage> {
    if (!this.swarmExtensionId) {
      this.swarmExtensionId = await this.swarmExtension.register()
    }

    // TODO Swarm extension should return debug address and alawys return addresses
    const beeAddress = (await this.swarmExtension.beeAddress()) || 'http://localhost:1633'
    const beeDebugAddress = 'http://localhost:1635'

    if (beeAddress !== this.beeAddress || beeDebugAddress !== this.beeDebugAddress) {
      this.fdpStorage = new FdpStorage(
        (this.beeAddress = beeAddress),
        (this.beeDebugAddress = beeDebugAddress),
      )
    }

    return this.fdpStorage
  }
}
