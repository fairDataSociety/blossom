import { Address, Bytes } from '../general.types'
import { Network } from './network.model'

export interface KeyData<SeedType> {
  seed: SeedType
  url: string
}

export interface Session<SeedType> {
  ensUserName?: string
  localUserName?: string
  network: Network
  address: Address
  key: KeyData<SeedType>
}

/**
 * Different versions of session for storage and memory
 * The difference is in the type of seed
 * In the storage the seed is saved as a hex string
 * while in memory it's converted to bytes
 */
export type MemorySession = Session<Bytes<64>>
export type StorageSession = Session<string>
