import { utils, Contract, Signer, providers } from 'ethers'
import { NULL_ADDRESS } from '../constants/constants'
import ENSRegistryContract from '../contracts/ENSRegistry.json'
import PublicResolverContract from '../contracts/PublicResolver.json'
import SubdomainRegistrarContract from '../contracts/SubdomainRegistrar.json'

const { keccak256, toUtf8Bytes, namehash } = utils

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

    return owner === NULL_ADDRESS
  }

  public async createUsername(username: string, address: string): Promise<void> {
    if (!this.isUsernameValid(username)) {
      throw new Error(`ENS: Invalid username ${username}`)
    }

    await this.subdomainRegistrarContract.register(keccak256(toUtf8Bytes(username)), address)

    await this.ensRegistryContract.setResolver(
      this.hashSubdomain(username),
      this.publicResolverContract.address,
    )
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

  public getUserData(username: string): Promise<unknown> {
    return this.publicResolverContract.getAll(this.hashSubdomain(username))
  }

  private isUsernameValid(username: string): boolean {
    // TODO implementation
    return true
  }

  private hashSubdomain(subdomain: string): string {
    return namehash(`${subdomain}.${this.domain}`)
  }
}
