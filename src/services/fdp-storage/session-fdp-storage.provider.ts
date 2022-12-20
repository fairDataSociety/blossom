import { MemorySession } from '../../model/storage/session.model'
import { Swarm } from '../../model/storage/swarm.model'
import { SessionService } from '../session.service'
import { Storage } from '../storage/storage.service'
import { ExtendedFdpStorage } from './extended-fdp-storage'
import { FdpStorageProvider } from './fdp-storage.provider'

export class SessionFdpStorageProvider extends FdpStorageProvider {
  private storage: Storage = new Storage()
  private sessionService: SessionService = new SessionService()

  public async getService(): Promise<ExtendedFdpStorage> {
    const [session, swarm] = await Promise.all([this.sessionService.load(), this.storage.getSwarm()])

    return this.createFdpStorageInternal(session, swarm)
  }

  private async createFdpStorageInternal(session: MemorySession, swarm: Swarm): Promise<ExtendedFdpStorage> {
    const { network, key } = session || {}

    if (!network || !key) {
      throw new Error('Blossom: User is not logged in.')
    }

    const fdp = await this.createFdpStorage(network, swarm)

    fdp.account.setAccountFromSeed(key.seed)

    return fdp
  }
}
