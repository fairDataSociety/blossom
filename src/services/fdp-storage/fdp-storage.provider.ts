import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { networks } from '../../constants/networks'
import { Network } from '../../model/storage/network.model'
import { Swarm } from '../../model/storage/swarm.model'
import { SwarmExtension } from '../../swarm-api/swarm-extension'
import { AsyncConfigService } from '../async-config.service'

export abstract class FdpStorageProvider extends AsyncConfigService<FdpStorage> {
  public getService(): Promise<FdpStorage> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getConfig())
      })
    })
  }

  protected async createFdpStorage(network: Network, swarm: Swarm): Promise<FdpStorage> {
    const { beeApiUrl, beeDebugApiUrl } = await this.getBeeAddresses(swarm)
    const { ensRegistry, subdomainRegistrar, publicResolver, rpc, label } = network
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    if (process.env.CI_TESTS === 'true') {
      return {
        beeApiUrl: 'http://172.18.0.1:1633',
        beeDebugApiUrl: 'http://172.18.0.1:1635',
      }
    }

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
