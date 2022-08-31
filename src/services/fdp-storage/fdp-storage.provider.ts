import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { networks } from '../../constants/networks'
import { Network } from '../../model/storage/network.model'
import { Swarm } from '../../model/storage/swarm.model'
import { SwarmExtension } from '../../swarm-api/swarm-extension'
import { getBatchId } from '../../utils/bee'
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
    const batchId = await getBatchId(beeDebugApiUrl)
    const { ensRegistry, fdsRegistrar, publicResolver, rpc } = network
    const options = {
      ensOptions: {
        rpcUrl: rpc,
        contractAddresses: {
          ensRegistry,
          fdsRegistrar,
          publicResolver,
        },
        performChecks: true,
      },
      ensDomain: 'fds',
    }

    // If contract addresses are not specified, the addresses from fdp-play will be used
    if (!ensRegistry || !fdsRegistrar || !publicResolver) {
      const localhostNetwork = networks[0]

      options.ensOptions.contractAddresses = {
        ensRegistry: localhostNetwork.ensRegistry,
        fdsRegistrar: localhostNetwork.fdsRegistrar,
        publicResolver: localhostNetwork.publicResolver,
      }
    }

    // TODO cannot cast to BatchId because it's not exported
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new FdpStorage(beeApiUrl, batchId as any, options as unknown)
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
