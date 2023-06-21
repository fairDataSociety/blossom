import { BigNumber, Wallet, providers } from 'ethers'
import { Address, PrivateKey } from '../model/general.types'
import { Storage } from './storage/storage.service'

export class Blockchain {
  private storage: Storage = new Storage()

  public async getAccountBalance(address: Address, rpcUrl?: string): Promise<BigNumber> {
    return (await this.getProvider(rpcUrl)).getBalance(address)
  }

  public async sendTransaction(
    privateKey: PrivateKey,
    to: Address,
    value: BigNumber,
  ): Promise<providers.TransactionReceipt> {
    const provider = await this.getProvider()

    const wallet = new Wallet(privateKey).connect(provider)

    const tx = await wallet.sendTransaction({ to, value })

    return tx.wait()
  }

  private async getProvider(rpcUrl?: string): Promise<providers.JsonRpcProvider> {
    let rpc = rpcUrl

    if (!rpc) {
      const network = await this.storage.getNetwork()
      rpc = network.rpc
    }

    return this.createProvider(rpc)
  }

  private createProvider(rpc: string) {
    return new providers.JsonRpcProvider(rpc)
  }
}
