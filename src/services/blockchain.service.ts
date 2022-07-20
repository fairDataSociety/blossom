import { BigNumber, providers } from 'ethers'
import { Account } from '../model/general.types'
import { Network } from '../model/storage/network.model'
import { AsyncConfigService } from './async-config.service'
import { Storage } from './storage/storage.service'

export class Blockchain extends AsyncConfigService<providers.JsonRpcProvider> {
  private storage: Storage = new Storage()

  constructor() {
    super()
    super.initialize(async () => {
      const { rpc } = await this.storage.getNetwork()

      this.storage.onNetworkChange(({ rpc }: Network) => super.updateConfig(this.createProvider(rpc)))

      return this.createProvider(rpc)
    })
  }

  public async getAccountBalance(account: Account): Promise<BigNumber> {
    return (await this.getProvider()).getBalance(account)
  }

  private getProvider(): Promise<providers.JsonRpcProvider> {
    return super.getConfig()
  }

  private createProvider(rpc: string) {
    return new providers.JsonRpcProvider(rpc)
  }
}
