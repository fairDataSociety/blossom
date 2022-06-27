import { BigNumber, providers } from 'ethers'
import { Account } from '../model/general.types'

export class Blockchain {
  private provider: providers.JsonRpcProvider

  // TODO add configuration parameter
  constructor() {
    this.provider = new providers.JsonRpcProvider('http://localhost:9545')
  }

  public getAccountBalance(account: Account): Promise<BigNumber> {
    return this.provider.getBalance(account)
  }
}
