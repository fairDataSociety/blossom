import { Storage } from '../storage/storage.service'
import { Network } from '../../model/storage/network.model'
import { Swarm } from '../../model/storage/swarm.model'
import { FdpStorageProvider } from './fdp-storage.provider'

export class SessionlessFdpStorageProvider extends FdpStorageProvider {
  private storage: Storage = new Storage()
  private network: Network
  private swarm: Swarm

  constructor() {
    super()
    super.initialize(async () => {
      const [network, swarm] = await Promise.all([this.storage.getNetwork(), this.storage.getSwarm()])
      this.network = network
      this.swarm = swarm

      this.storage.onNetworkChange((network: Network) =>
        super.updateConfigAsync(this.createFdpStorage((this.network = network), this.swarm)),
      )

      this.storage.onSwarmChange((swarm: Swarm) =>
        super.updateConfigAsync(this.createFdpStorage(this.network, (this.swarm = swarm))),
      )

      return this.createFdpStorage(this.network, swarm)
    })
  }
}
