import { Address, Bytes } from '../general.types'
import { Network } from './network.model'

export interface Account<SeedType> {
  name: string
  address: Address
  seed: SeedType
  network: Network
}

/**
 * Different versions of account for storage and memory
 * The difference is in the type of seed
 * In the storage the seed is saved as a hex string
 * while in memory it's converted to bytes
 */
export type MemoryAccount = Account<Bytes<64>>
export type StorageAccount = Account<string>

export interface Accounts {
  [name: string]: StorageAccount
}
