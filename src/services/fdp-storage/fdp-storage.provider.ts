import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { POSTAGE_BATCH_ID } from '../../constants/constants'
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
    const beeApiUrl = await this.getBeeAddresses(swarm)
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
    return new FdpStorage(beeApiUrl, this.getPostageBatchId() as any, options as unknown)
  }

  private async getBeeAddresses(swarm: Swarm): Promise<string> {
    let beeApiUrl = 'http://localhost:1633'

    if (process.env.CI_TESTS === 'true') {
      return 'http://172.18.0.1:1633'
    }

    try {
      const swarmExtension = new SwarmExtension(swarm.extensionId)
      const beeAddresses = await swarmExtension.beeAddress()

      beeApiUrl = beeAddresses.beeApiUrl
    } catch (error) {
      console.error("Blossom: Couldn't connect to the Swarm extension.")
      throw error
    }

    return beeApiUrl
  }

  private getPostageBatchId(): string {
    if (process.env.environment === 'production') {
      return POSTAGE_BATCH_ID
    }

    return process.env.POSTAGE_BATCH_ID
  }
}
