import { Storage } from '../storage/storage.service'
import { FdpStorageProvider } from './fdp-storage.provider'
import { FdpStorage } from '@fairdatasociety/fdp-storage'

export class SessionlessFdpStorageProvider extends FdpStorageProvider {
  private storage: Storage = new Storage()

  public async getService(): Promise<FdpStorage> {
    const [network, swarm] = await Promise.all([this.storage.getNetwork(), this.storage.getSwarm()])

    return this.createFdpStorage(network, swarm)
  }
}
