import { Address, Bytes } from '../general.types'
import { Network } from './network.model'

export interface KeyData<SeedType> {
  seed: SeedType
  url: string
}

export interface Session<SeedType> {
  username?: string
  account?: string
  network: Network
  address: Address
  key: KeyData<SeedType>
}

export type MemorySession = Session<Bytes<64>>
export type StorageSession = Session<string>
