import { Address, Bytes } from '../general.types'
import { Network } from './network.model'

export interface Account<SeedType> {
  name: string
  address: Address
  seed: SeedType
  salt: number[]
  hash: number[]
  network: Network
}

export type MemoryAccount = Account<Bytes<64>>
export type StorageAccount = Account<string>

export interface Accounts {
  [name: string]: StorageAccount
}
