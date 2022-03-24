import { Signer } from 'ethers'

export interface SignerProvider {
  getSigner(): Signer
  getAddress(): string
  getPublicKey(): string
}
