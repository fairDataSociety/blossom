import { Wallet } from 'ethers'

export function generateMnemonic(): string {
  const wallet = Wallet.createRandom()

  return wallet.mnemonic.phrase
}
