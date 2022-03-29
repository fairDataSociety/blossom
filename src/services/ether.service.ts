import { providers } from 'ethers'
import { NULL_ADDRESS } from '../constants/constants'
import { ENS } from '../services/ens.service'
import { SimpleSignerProvider } from '../services/simple-signer-provider.service'
import { SignerProvider } from './signer-provider.interface'

/**
 * Ether class
 * Provides methods to interact with ethereum
 */
export class Ether {
  private provider: providers.JsonRpcProvider
  private signerProvider: SignerProvider
  private ens: ENS

  constructor() {
    this.provider = new providers.JsonRpcProvider(process.env.ETH_GATEWAY)
    this.signerProvider = new SimpleSignerProvider(this.provider)
    this.ens = new ENS(
      this.provider,
      process.env.ENS_DOMAIN,
      process.env.ENS_REGISTRY_ADDRESS,
      process.env.ENS_SUBDOMAIN_REGISTRAR_ADDRESS,
      process.env.ENS_PUBLIC_RESOLVER_ADDRESS,
    )
    this.ens.connect(this.signerProvider.getSigner())
  }

  public async registerUsername(username: string): Promise<void> {
    const ownerAddress = await this.ens.getUsernameAddress(username)
    const address = this.signerProvider.getAddress()

    if (ownerAddress !== NULL_ADDRESS && ownerAddress !== address) {
      throw new Error(`auth.listener: Username ${username} is not available`)
    }

    if (ownerAddress === NULL_ADDRESS) {
      await this.ens.registerUsername(username, address)
    }

    await this.ens.setUsernameResolver(username)

    await this.ens.setUsernamePublicKey(username, address, this.signerProvider.getPublicKey())
  }

  public getUserData(username: string): Promise<unknown> {
    return this.ens.getUserData(username)
  }

  public getSignerProvider(): SignerProvider {
    return this.signerProvider
  }
}
