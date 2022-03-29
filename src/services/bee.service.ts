import { Signer } from 'ethers'
import { Bee as BeeJs, Signer as BeeSigner, Data } from '@ethersphere/bee-js'
import { SwarmExtension } from '../swarm-api/swarm-extension'
import { arrayify, keccak256 } from 'ethers/lib/utils'
import { Bytes } from '@ethersphere/bee-js/dist/types/utils/bytes'

export class Bee {
  private swarmExtension: SwarmExtension
  private bee: BeeJs
  private connectionPromise: Promise<void> = null

  constructor(swarmExtensionId: string) {
    this.swarmExtension = new SwarmExtension(swarmExtensionId)
  }

  public async connect(): Promise<void> {
    await this.swarmExtension.register()

    const beeAddress = await this.swarmExtension.beeAddress()

    this.bee = new BeeJs(beeAddress)
  }

  public async createFeed(
    username: string,
    batchId: string,
    passphrase: string,
    publicKey: string,
    signer: Signer,
  ): Promise<void> {
    await this.checkConnection()

    const topic = this.createTopic(username)
    const address = await signer.getAddress()

    const beeSigner = this.toBeeSigner(signer, address)

    const writer = await this.bee.makeFeedWriter('sequence', topic, beeSigner)

    await this.bee.createFeedManifest(batchId, 'sequence', topic, address)

    const data = new TextEncoder().encode(keccak256(passphrase + publicKey))

    const uploadResult = await this.bee.uploadData(batchId, data)

    await writer.upload(batchId, uploadResult.reference)
  }

  private checkConnection(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise
    }

    return (this.connectionPromise = this.connect())
  }

  private createTopic(username: string): string {
    return this.bee.makeFeedTopic(`Topic.${username}`)
  }

  private toBeeSigner(signer: Signer, address: string): BeeSigner {
    return {
      sign: (data: Data) => signer.signMessage(data.text()),
      address: arrayify(address) as Bytes<20>,
    }
  }
}
