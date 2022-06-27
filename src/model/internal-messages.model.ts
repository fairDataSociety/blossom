import { Network } from './storage/network.model'
import { Account, Mnemonic, PrivateKey } from './general.types'

export interface LoginData {
  username: string
  password: string
  network: Network
}

export interface RegisterData {
  username: string
  password: string
  privateKey: PrivateKey
  network: Network
}

export interface UsernameCheckData {
  username: string
  network: Network
}

export interface RegisterResponse {
  account: Account
  mnemonic: Mnemonic
  privateKey: PrivateKey
}
