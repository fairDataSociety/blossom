import { Wallet, providers, Signer } from 'ethers'
import { SignerProvider } from './signer-provider.interface'

// TODO Experimental signer
export class SimpleSignerProvider implements SignerProvider {
  private privateKey = '0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd'
  private wallet: Wallet

  constructor(provider: providers.Provider) {
    this.wallet = new Wallet(this.privateKey, provider)
  }

  public getSigner(): Signer {
    return this.wallet
  }

  public getAddress(): string {
    return this.wallet.address
  }

  public getPublicKey(): string {
    return this.wallet.publicKey
  }
}
