import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { ExtendedFdpStorage } from './extended-fdp-storage'
import { networks } from '../../constants/networks'
import { Network } from '../../model/storage/network.model'
import { Swarm } from '../../model/storage/swarm.model'
import { SwarmExtension } from '../../swarm-api/swarm-extension'
import { getBatchId } from '../../utils/bee'
import { createPersonalStorageProxy } from './extended-personal-storage'

export abstract class FdpStorageProvider {
  public abstract getService(): Promise<ExtendedFdpStorage>

  protected async createFdpStorage(network: Network, swarm: Swarm): Promise<ExtendedFdpStorage> {
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
    const fdpStorage = new FdpStorage(beeApiUrl, batchId as any, options as unknown)

    // Replaces the personalStorage property with a proxy object that extends its functionalities
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(fdpStorage as ExtendedFdpStorage).personalStorage = createPersonalStorageProxy(
      fdpStorage.personalStorage,
    )

    return fdpStorage as ExtendedFdpStorage
  }

  private async getBeeAddresses(swarm: Swarm): Promise<{
    beeApiUrl: string
    beeDebugApiUrl: string
  }> {
    let beeApiUrl = swarm.swarmUrl || 'http://localhost:1633',
      beeDebugApiUrl = 'http://localhost:1635'

    if (process.env.CI_TESTS === 'true') {
      return {
        beeApiUrl: 'http://172.18.0.1:1633',
        beeDebugApiUrl: 'http://172.18.0.1:1635',
      }
    }

    if (!swarm.extensionEnabled) {
      return { beeApiUrl, beeDebugApiUrl: null }
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
