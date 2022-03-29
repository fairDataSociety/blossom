import { utils, Contract, Signer, providers } from 'ethers'
import { NULL_ADDRESS } from '../constants/constants'
import ENSRegistryContract from '../contracts/ENSRegistry.json'
import PublicResolverContract from '../contracts/PublicResolver.json'
import SubdomainRegistrarContract from '../contracts/SubdomainRegistrar.json'

const { keccak256, toUtf8Bytes, namehash } = utils

/**
 * ENS Class
 * Provides interface for interaction with the ENS smart contracts
 */
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

  /**
   * Connects the provided signer to the smart contracts
   * @param signerOrProvider An instance of ethers.js Wallet or any other signer
   */
  public connect(signerOrProvider: string | providers.Provider | Signer) {
    this.publicResolverContract = this.publicResolverContract.connect(signerOrProvider)
    this.subdomainRegistrarContract = this.subdomainRegistrarContract.connect(signerOrProvider)
    this.ensRegistryContract = this.ensRegistryContract.connect(signerOrProvider)
  }

  /**
   * Returns the owner address of the provided username on ENS
   * @param username ENS username
   * @returns owner's address
   */
  public async getUsernameAddress(username: string): Promise<string> {
    if (!this.isUsernameValid(username)) {
      throw new Error(`ENS: Invalid username ${username}`)
    }

    const usernameHash = this.hashSubdomain(username)

    const owner = await this.ensRegistryContract.owner(usernameHash)

    return owner
  }

  /**
   * Checks whether the provided username is available on ENS
   * @param username ENS username
   * @returns True if the username is available
   */
  public async isUsernameAvailable(username: string): Promise<boolean> {
    const owner = await this.getUsernameAddress(username)

    return owner === NULL_ADDRESS
  }

  /**
   * Sets the owner of the provided username on ENS
   * @param username ENS username
   * @param address Owner address of the username
   */
  public registerUsername(username: string, address: string): Promise<void> {
    return this.subdomainRegistrarContract.register(keccak256(toUtf8Bytes(username)), address)
  }

  /**
   * Sets resolver for the provided ENS username
   * @param username ENS username
   */
  public setUsernameResolver(username: string): Promise<void> {
    return this.ensRegistryContract.setResolver(
      this.hashSubdomain(username),
      this.publicResolverContract.address,
    )
  }

  /**
   * Sets user's public key to the user's ENS entry
   * @param username ENS username
   * @param address Owner of the username
   * @param publicKey Public key that will be added to ENS
   */
  public setUsernamePublicKey(username: string, address: string, publicKey: string): Promise<void> {
    const usernameHash = this.hashSubdomain(username)
    const [publicKeyX, publicKeyY] = this.splitPublicKey(publicKey)
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

  /**
   * Fetches all ENS data related to the provided username
   * @param username ENS username
   * @returns
   */
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

  private splitPublicKey(publicKey: string): [string, string] {
    const publicKeyX = publicKey.substring(0, 66)
    const publicKeyY = '0x' + publicKey.substring(66, 130)

    return [publicKeyX, publicKeyY]
  }
}
