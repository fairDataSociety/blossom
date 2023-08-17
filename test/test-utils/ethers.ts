import { providers, Wallet, utils } from 'ethers'
import { RPC_PROVIDER_URL } from '../config/constants'

export async function sendFunds(
  senderPrivateKey: string,
  toAccount: string,
  ethAmount: string,
): Promise<void> {
  const provider = new providers.JsonRpcProvider(RPC_PROVIDER_URL)
  const wallet = new Wallet(senderPrivateKey, provider)

  const tx = await wallet.sendTransaction({
    to: toAccount,
    value: utils.parseEther(ethAmount),
  })

  await tx.wait()
}

export async function checkConnection(): Promise<void> {
  const provider = new providers.JsonRpcProvider(RPC_PROVIDER_URL)

  await provider.getBlockNumber()
}

/**
 * Removes 0x from hex string
 */
export function removeZeroFromHex(value: string): string {
  return value.replace('0x', '')
}
