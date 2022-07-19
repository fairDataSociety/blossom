import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { networks } from '../constants/networks'
import { Network } from '../model/storage/network.model'
import { Swarm } from '../model/storage/swarm.model'
import { SwarmExtension } from '../swarm-api/swarm-extension'
import { AsyncConfigService } from './async-config.service'
import { Storage } from './storage/storage.service'

export class FdpStorageProvider extends AsyncConfigService<FdpStorage> {
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

      return this.createFdpStorage(network, swarm)
    })
  }

  public getService(): Promise<FdpStorage> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getConfig())
      })
    })
  }

  private async createFdpStorage(network: Network, swarm: Swarm): Promise<FdpStorage> {
    const { beeApiUrl, beeDebugApiUrl } = await this.getBeeAddresses(swarm)
    const { ensRegistry, subdomainRegistrar, publicResolver, rpc, label } = network
    let options: any

    // TODO A workaround until the fdp-storage is updated to re-export ENS environments
    if (label !== networks[0].label) {
      options = {
        ensOptions: {
          rpcUrl: rpc,
          contractAddresses: {
            ensRegistry,
            subdomainRegistrar,
            publicResolver,
          },
          performChecks: true,
        },
        ensDomain: 'fds',
      }
    }

    return new FdpStorage(beeApiUrl, beeDebugApiUrl, options as unknown)
  }

  private async getBeeAddresses(swarm: Swarm): Promise<{
    beeApiUrl: string
    beeDebugApiUrl: string
  }> {
    let beeApiUrl = 'http://localhost:1633',
      beeDebugApiUrl = 'http://localhost:1635'

    try {
      const swarmExtension = new SwarmExtension(swarm.extensionId)
      const beeAddresses = await swarmExtension.beeAddress()

      beeApiUrl = beeAddresses.beeApiUrl
      beeDebugApiUrl = beeAddresses.beeDebugApiUrl
    } catch (error) {
      console.error("Blossom: Couldn't connect to the Swarm extension.")
      throw error
    }

    return { beeApiUrl, beeDebugApiUrl }
  }
}
