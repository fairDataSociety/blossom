import { Address, BigNumberString, HexStringVariate } from '../general.types'

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
  }
}

export type TransactionType = 'regular' | 'asset'

export type Transactions = Record<TransactionType, Transaction[]>

export type TransactionsByNetworkLabel = Record<string, Transactions>

export interface Wallet {
  lockInterval?: number
  transactionsByNetworkLabel: TransactionsByNetworkLabel
}

export interface Wallets {
  [accountName: string]: Wallet
}
