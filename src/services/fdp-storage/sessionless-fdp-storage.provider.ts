import { Storage } from '../storage/storage.service'
import { FdpStorageProvider } from './fdp-storage.provider'
import { ExtendedFdpStorage } from './extended-fdp-storage'

export class SessionlessFdpStorageProvider extends FdpStorageProvider {
  private storage: Storage = new Storage()

  public async getService(): Promise<ExtendedFdpStorage> {
    const [network, swarm] = await Promise.all([this.storage.getNetwork(), this.storage.getSwarm()])

    return this.createFdpStorage(network, swarm)
  }
}
