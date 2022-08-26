import { Account, Bytes } from '../general.types'
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
  local?: boolean
}

export type MemorySession = Session<Bytes<64>>
export type StorageSession = Session<string>
