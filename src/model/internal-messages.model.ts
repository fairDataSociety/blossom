import { Network } from './storage/network.model'
import { Account, Mnemonic, PrivateKey } from './general.types'

export interface LoginData {
  username: string
  password: string
  network: Network
}

export interface RegisterDataBase {
  username: string
  password: string
  network: Network
}

export interface RegisterDataMnemonic extends RegisterDataBase {
  mnemonic: Mnemonic
}

export interface RegisterDataPrivateKey extends RegisterDataBase {
  privateKey: PrivateKey
}

export type RegisterData = RegisterDataMnemonic | RegisterDataPrivateKey

export interface UsernameCheckData {
  username: string
  network: Network
}

export interface RegisterResponse {
  account: Account
  mnemonic: Mnemonic
  privateKey: PrivateKey
}

export interface UserResponse {
  username: string
  account: Account
  network: Network
}

export interface NetworkEditData {
  label: string
  network: Network
}

/**
 * fdp-storage request
 * It describes which method a dApp wants to invoke and with which parameters
 * @param accessor is a complete path of a method that belongs to the fdp-storage object.
 * For example, to invoke the fdpStorageInstance.personalStorage.create method,
 * the accessor property will have the value 'personalStorage.create'
 * @param parameters is an array of all parameters that the method expects
 */
export interface FdpStorageRequest {
  accessor: string
  parameters: unknown[]
}

export interface DialogQuestion {
  question: string
  placeholders: Record<string, string>
}
