import { BigNumber, utils } from 'ethers'
import { Address } from '../../../model/general.types'
import { Token } from '../../../model/storage/wallet.model'

export const valueRegex = /^\d+(\.\d+)?$/g
export const addressRegex = /^0x[a-fA-F0-9]{40}$/g

export function roundEther(value: string): string {
  const pointIndex = value.indexOf('.')

  if (!pointIndex) {
    return value
  }

  return value.substring(0, pointIndex + 5)
}

export function isValueValid(value: string): boolean {
  return valueRegex.test(value)
}

export function isAddressValid(address: string): boolean {
  return addressRegex.test(address)
}

export function displayAddress(address: Address): string {
  return `${address.substring(0, 5)}...${address.substring(address.length - 4)}`
}

export function convertFromDecimal(amount: string, decimals?: number): BigNumber {
  return utils.parseUnits(amount, decimals || 'ether')
}

export function convertToDecimal(amount: BigNumber, decimals?: number): string {
  return utils.formatUnits(amount, decimals || 'ether')
}

export function constructBlockExplorerUrl(blockExplorerBaseUrl: string, txHash: string): string {
  return blockExplorerBaseUrl.endsWith('/')
    ? `${blockExplorerBaseUrl}${txHash}`
    : `${blockExplorerBaseUrl}/${txHash}`
}

export function displayBalance(balance: BigNumber, token?: Token): string {
  return token
    ? `${utils.formatUnits(balance, token.decimals)} ${token.symbol}`
    : `${roundEther(utils.formatEther(balance))} ETH`
}
