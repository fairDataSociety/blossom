import { Network } from './storage/network.model'
import { Address, Mnemonic, PrivateKey } from './general.types'

export interface LoginData {
  username: string
  password: string
  network: Network
}

export interface LocalLoginData {
  name: string
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

export type RegisterData = RegisterDataMnemonic

export interface ImportAccountData {
  name: string
  password: string
  mnemonic: Mnemonic
  network: Network
}

export interface UsernameCheckData {
  username: string
  network: Network
}

export interface RegisterResponse {
  address: Address
  mnemonic: Mnemonic
  privateKey: PrivateKey
}

export interface UserResponse {
  ensUserName?: string
  localUserName?: string
  address: Address
  network: Network
}

export interface AccountResponse {
  name: string
  address: Address
  network: Network
}

export interface NetworkEditData {
  label: string
  network: Network
}

export interface SignerRequest {
  podName: string
  message: string
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

export interface Transaction {
  to: Address
  // in wei
  amount: string
}

export interface AccountBalanceRequest {
  address: Address
  rpcUrl?: string
}
