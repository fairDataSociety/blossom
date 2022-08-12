import { PrivateKey } from '../general.types'
import { Network } from './network.model'

export interface KeyData {
  privateKey: PrivateKey
  url: string
}

export interface Session {
  username: string
  network: Network
  key: KeyData
}
