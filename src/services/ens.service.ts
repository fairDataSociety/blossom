import { utils, Contract, Signer, providers } from 'ethers'
import ENSRegistryContract from '../contracts/ENSRegistry.json'
import PublicResolverContract from '../contracts/PublicResolver.json'
import SubdomainRegistrarContract from '../contracts/SubdomainRegistrar.json'

const { keccak256, toUtf8Bytes } = utils

export class ENS {
  private ensRegistryContract: Contract
  private subdomainRegistrarContract: Contract
  private publicResolverContract: Contract

  constructor(
    private provider,
    private domain: string,
    ensAddress: string,
    subdomainRegistrarAddress: string,
    publicResolverAddress: string,
  ) {
    this.ensRegistryContract = new Contract(ensAddress, ENSRegistryContract.abi, this.provider)

    this.publicResolverContract = new Contract(
      publicResolverAddress,
      PublicResolverContract.abi,
      this.provider,
    )

    this.subdomainRegistrarContract = new Contract(
      subdomainRegistrarAddress,
      SubdomainRegistrarContract.abi,
      this.provider,
    )
  }

  public connect(signerOrProvider: string | providers.Provider | Signer) {
    this.publicResolverContract = this.publicResolverContract.connect(signerOrProvider)
    this.subdomainRegistrarContract = this.subdomainRegistrarContract.connect(signerOrProvider)
    this.ensRegistryContract = this.ensRegistryContract.connect(signerOrProvider)
  }

  public async isUsernameAvailable(username: string): Promise<boolean> {
    if (!this.isUsernameValid(username)) {
      throw new Error(`ENS: Invalid username ${username}`)
    }

    const usernameHash = this.hashSubdomain(username)

    const owner = await this.ensRegistryContract.owner(usernameHash)

    return owner === '0x0000000000000000000000000000000000000000'
  }

  public async createUsername(username: string, address: string): Promise<void> {
    if (!this.isUsernameValid(username)) {
      throw new Error(`ENS: Invalid username ${username}`)
    }

    const usernameHash = this.hashSubdomain(username)

    let result = await this.subdomainRegistrarContract.register(usernameHash, address)

    console.log(result)

    result = await this.ensRegistryContract.setResolver(usernameHash, this.publicResolverContract.address)

    console.log('setResolver', result)
  }

  public setUsernamePublicKey(username: string, address: string, publicKey: string): Promise<void> {
    const usernameHash = this.hashSubdomain(username)
    const publicKeyX = publicKey.substring(0, 66)
    const publicKeyY = '0x' + publicKey.substring(66, 130)
    const content = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const name = 'subdomain-hidden'

    return this.publicResolverContract.setAll(
      usernameHash,
      address,
      content,
      '0x00',
      publicKeyX,
      publicKeyY,
      name,
    )
  }

  private isUsernameValid(username: string): boolean {
    // TODO implementation
    return true
  }

  private hashSubdomain(subdomain: string): string {
    return keccak256(toUtf8Bytes(`${subdomain}`))
  }
}
