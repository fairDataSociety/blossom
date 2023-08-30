import { Address, Bytes } from '../general.types'
import { Network } from './network.model'

export interface Session {
  ensUserName?: string
  localUserName?: string
  password: string
  network: Network
  address: Address
  seed: Bytes<64>
}
