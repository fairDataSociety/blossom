import { providers } from 'ethers'
import { ENS } from '../services/ens.service'
import { SimpleSignerProvider } from '../services/simple-signer-provider.service'
import { SignerProvider } from './signer-provider.interface'

export class Ether {
  private provider: providers.JsonRpcProvider
  private signer: SignerProvider
  private ens: ENS

  constructor() {
    this.provider = new providers.JsonRpcProvider(process.env.ETH_GATEWAY)
    this.signer = new SimpleSignerProvider(this.provider)
    this.ens = new ENS(
      this.provider,
      process.env.ENS_DOMAIN,
      process.env.ENS_REGISTRY_ADDRESS,
      process.env.ENS_SUBDOMAIN_REGISTRAR_ADDRESS,
      process.env.ENS_PUBLIC_RESOLVER_ADDRESS,
    )
    this.ens.connect(this.signer.getSigner())
  }

  public async registerUsername(username: string): Promise<void> {
    const usernameAvailable = await this.ens.isUsernameAvailable(username)

    if (!usernameAvailable) {
      throw new Error(`auth.listener: Username ${username} is not available`)
    }

    const address = this.signer.getAddress()

    await this.ens.createUsername(username, address)

    await this.ens.setUsernamePublicKey(username, address, this.signer.getPublicKey())
  }

  public getUserData(username: string): Promise<unknown> {
    return this.ens.getUserData(username)
  }
}
