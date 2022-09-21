import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { MemorySession } from '../../model/storage/session.model'
import { Swarm } from '../../model/storage/swarm.model'
import { SessionService } from '../session.service'
import { Storage } from '../storage/storage.service'
import { FdpStorageProvider } from './fdp-storage.provider'

export class SessionFdpStorageProvider extends FdpStorageProvider {
  private storage: Storage = new Storage()
  private sessionService: SessionService = new SessionService()

  public async getService(): Promise<FdpStorage> {
    const [session, swarm] = await Promise.all([this.sessionService.load(), this.storage.getSwarm()])

    return this.createFdpStorageInternal(session, swarm)
  }

  private async createFdpStorageInternal(session: MemorySession, swarm: Swarm): Promise<FdpStorage> {
    const { network, key } = session || {}

    if (!network || !key) {
      return Promise.resolve(null)
    }

    const fdp = await this.createFdpStorage(network, swarm)

    fdp.account.setAccountFromSeed(key.seed)

    return fdp
  }
}
