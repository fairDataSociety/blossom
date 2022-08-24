import { Account } from '../general.types'
import { Network } from './network.model'

export interface KeyData<SeedType> {
  seed: SeedType
  url: string
}

export interface Session<SeedType> {
  username: string
  network: Network
  account: Account
  key: KeyData<SeedType>
}

export type MemorySession = Session<Uint8Array>
export type StorageSession = Session<string>
