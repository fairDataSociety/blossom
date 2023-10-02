import { Address, BigNumberString, HexString, HexStringVariate } from '../general.types'

export type TransactionDirection = 'sent' | 'received'

export interface Transaction {
  id: string
  time: number
  direction: TransactionDirection
  content: {
    from: Address
    to: Address
    value?: BigNumberString
    gas: BigNumberString
    gasPrice: BigNumberString
    data?: HexStringVariate
    hash: HexString<64>
  }
  token?: Token
}

export type TransactionType = 'regular' | 'asset'

export type Transactions = Record<TransactionType, Transaction[]>

export type TransactionsByNetworkLabel = Record<string, Transactions>

export interface WalletConfig {
  lockInterval?: number
}

export interface Token {
  address: Address
  name: string
  symbol: string
  decimals: number
}

export type TokensByNetworkLabel = Record<string, Token[]>

export interface Wallet {
  config: WalletConfig
  // TODO Define contacts
  accounts: Record<Address, unknown>
  tokens: TokensByNetworkLabel
  transactionsByNetworkLabel: TransactionsByNetworkLabel
}

export interface Wallets {
  [accountName: string]: Wallet
}
