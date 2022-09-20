import { BigNumber, providers } from 'ethers'
import { Address } from '../model/general.types'
import { Storage } from './storage/storage.service'

export class Blockchain {
  private storage: Storage = new Storage()

  public async getAccountBalance(address: Address): Promise<BigNumber> {
    return (await this.getProvider()).getBalance(address)
  }

  private async getProvider(): Promise<providers.JsonRpcProvider> {
    const { rpc } = await this.storage.getNetwork()

    return this.createProvider(rpc)
  }

  private createProvider(rpc: string) {
    return new providers.JsonRpcProvider(rpc)
  }
}
