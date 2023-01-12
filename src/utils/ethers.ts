import { Wallet, utils } from 'ethers'

export function generateMnemonic(): string {
  const wallet = Wallet.createRandom()

  return wallet.mnemonic.phrase
}

/**
 * Get Hierarchal Deterministic Wallet from seed by index
 *
 * @param seed data for wallet creation
 * @param index wallet index
 */
export function getWalletByIndex(seed: Uint8Array, index: number): utils.HDNode {
  const node = utils.HDNode.fromSeed(seed)

  return node.derivePath(`m/44'/60'/0'/0/${index}`)
}
