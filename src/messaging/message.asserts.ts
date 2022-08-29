import { Address } from '../model/general.types'
import {
  FdpStorageRequest,
  ImportAccountData,
  LocalLoginData,
  LoginData,
  NetworkEditData,
  RegisterData,
  RegisterDataBase,
  RegisterDataMnemonic,
  UsernameCheckData,
} from '../model/internal-messages.model'
import { Network } from '../model/storage/network.model'
import { KeyData, StorageSession } from '../model/storage/session.model'
import { Swarm } from '../model/storage/swarm.model'

export function isLoginData(data: unknown): data is LoginData {
  const { username, password, network } = (data || {}) as LoginData

  return Boolean(typeof username === 'string' && typeof password === 'string' && isNetwork(network))
}

export function isLocalLoginData(data: unknown): data is LocalLoginData {
  const { name, password } = (data || {}) as LocalLoginData

  return Boolean(typeof name === 'string' && typeof password === 'string')
}

export function isRegisterData(data: unknown): data is RegisterData {
  return isRegisterDataMnemonic(data)
}

export function isImportAccountData(data: unknown): data is ImportAccountData {
  const { name, password, mnemonic, network } = (data || {}) as ImportAccountData

  return Boolean(name && password && mnemonic && isNetwork(network))
}

export function isRegisterDataMnemonic(data: unknown): data is RegisterDataMnemonic {
  const registerData = (data || {}) as RegisterDataMnemonic

  return Boolean(isRegisterDataBase(data) && registerData.mnemonic)
}

export function isRegisterDataBase(data: unknown): data is RegisterDataBase {
  const { username, password, network } = (data || {}) as RegisterDataBase

  return Boolean(username && password && isNetwork(network))
}

export function isAddress(data: unknown): data is Address {
  return typeof data === 'string' && data.startsWith('0x') && data.length === 42
}

export function isUsernameCheckData(data: unknown): data is UsernameCheckData {
  const usernameCheckData = (data || {}) as UsernameCheckData

  return Boolean(usernameCheckData.username && usernameCheckData.network)
}

export function isNetwork(data: unknown): data is Network {
  const network = (data || {}) as Network

  return Boolean(network.label && network.rpc)
}

export function isNetworkEditData(data: unknown): data is NetworkEditData {
  const { label, network } = (data || {}) as NetworkEditData

  return Boolean(label && isNetwork(network))
}

export function isSwarm(data: unknown): data is Swarm {
  const { extensionId } = (data || {}) as Swarm

  return typeof extensionId === 'string'
}

export function isStorageKeyData(data: unknown): data is KeyData<string> {
  const { seed, url } = (data || {}) as KeyData<string>

  return typeof seed === 'string' && typeof url === 'string'
}

export function isStorageSession(data: unknown): data is StorageSession {
  const { username, account, network, key } = (data || {}) as StorageSession

  return (
    (typeof username === 'string' || typeof account === 'string') &&
    isNetwork(network) &&
    isStorageKeyData(key)
  )
}

export function isFdpStorageRequest(data: unknown): data is FdpStorageRequest {
  const { accessor, parameters } = (data || {}) as FdpStorageRequest

  return typeof accessor === 'string' && Array.isArray(parameters)
}

export function assertBeeUrl(url: string): asserts url {
  if (!url || !(url.startsWith('http://') || url.startsWith('https://'))) {
    throw new Error('Blossom: Invalid Bee URL')
  }
}
