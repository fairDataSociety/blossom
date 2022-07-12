import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { networks } from '../constants/networks'
import { Network } from '../model/storage/network.model'
import { SwarmExtension } from '../swarm-api/swarm-extension'
import { areNetworksEqual } from '../utils/asserts'
import { Storage } from './storage/storage.service'

export class FdpStorageProvider {
  private fdpStorage: FdpStorage
  private swarmExtension: SwarmExtension = new SwarmExtension(process.env.SWARM_EXTENSION_ID)
  private storage: Storage = new Storage()
  private beeAddress: string
  private beeDebugAddress: string
  private currentNetwork: Network

  public async getService(): Promise<FdpStorage> {
    const [network, beeAddresses] = await Promise.all([
      this.storage.getNetwork(),
      this.swarmExtension.beeAddress(),
    ])
    let { beeApiUrl, beeDebugApiUrl } = beeAddresses || {}
    beeApiUrl = beeApiUrl || 'http://localhost:1633'
    beeDebugApiUrl = beeDebugApiUrl || 'http://localhost:1635'

    if (
      beeApiUrl !== this.beeAddress ||
      beeDebugApiUrl !== this.beeDebugAddress ||
      !areNetworksEqual(this.currentNetwork, network)
    ) {
      this.createFdpStorage(network, beeApiUrl, beeDebugApiUrl)
    }

    return this.fdpStorage
  }

  private createFdpStorage(network: Network, beeApiUrl: string, beeDebugApiUrl: string) {
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

    this.currentNetwork = network
    this.fdpStorage = new FdpStorage(
      (this.beeAddress = beeApiUrl),
      (this.beeDebugAddress = beeDebugApiUrl),
      options as unknown,
    )
  }
}
