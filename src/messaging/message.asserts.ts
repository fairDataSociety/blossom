import { Address } from '../model/general.types'
import {
  AccountBalanceRequest,
  FdpStorageRequest,
  ImportAccountData,
  LocalLoginData,
  LoginData,
  NetworkEditData,
  RegisterData,
  RegisterDataBase,
  RegisterDataMnemonic,
  SignerRequest,
  Transaction,
  UsernameCheckData,
} from '../model/internal-messages.model'
import { Dapp, PodActions, PodPermission } from '../model/storage/dapps.model'
import { Network } from '../model/storage/network.model'
import { KeyData, StorageSession } from '../model/storage/session.model'
import { Swarm } from '../model/storage/swarm.model'
import { BytesMessage } from './scripts.messaging'

export function isString(data: unknown): data is string {
  return typeof data === 'string'
}

export function isLoginData(data: unknown): data is LoginData {
  const { username, password, network } = (data || {}) as LoginData

  return Boolean(typeof username === 'string' && typeof password === 'string' && isNetwork(network))
}

export function isLocalLoginData(data: unknown): data is LocalLoginData {
  const { name, password, network } = (data || {}) as LocalLoginData

  return Boolean(typeof name === 'string' && typeof password === 'string' && isNetwork(network))
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
  const { ensUserName, localUserName, network, key } = (data || {}) as StorageSession

  return (
    (typeof ensUserName === 'string' || typeof localUserName === 'string') &&
    isNetwork(network) &&
    isStorageKeyData(key)
  )
}

export function isFdpStorageRequest(data: unknown): data is FdpStorageRequest {
  const { accessor, parameters } = (data || {}) as FdpStorageRequest

  return typeof accessor === 'string' && Array.isArray(parameters)
}

export function isPodActions(data: unknown): data is PodActions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (<any>Object).values(PodActions).includes(data)
}

export function isPodPermission(data: unknown): data is PodPermission {
  const podPermission = (data || {}) as PodPermission

  return (
    isString(podPermission.podName) &&
    Array.isArray(podPermission.allowedActions) &&
    podPermission.allowedActions.every(isPodActions)
  )
}

export function isDapp(data: unknown): data is Dapp {
  const dapp = (data || {}) as Dapp

  return Boolean(
    isString(dapp.dappId) && typeof dapp.podPermissions === 'object' && Object.values(isPodPermission),
  )
}

export function isSignerRequest(data: unknown): data is SignerRequest {
  const { podName, message } = (data || {}) as SignerRequest

  return typeof podName === 'string' && typeof message === 'string'
}

export function assertBeeUrl(url: string): asserts url {
  if (!url || !(url.startsWith('http://') || url.startsWith('https://'))) {
    throw new Error('Blossom: Invalid Bee URL')
  }
}

export function isSerializedUint8Array(data: unknown): data is BytesMessage {
  const { type, value } = (data || {}) as BytesMessage

  return type === 'bytes' && isString(value)
}

export function isTransaction(data: unknown): data is Transaction {
  const { to, value, data: txData, rpcUrl } = (data || {}) as Transaction

  return isAddress(to) && isString(rpcUrl) && (isString(value) || isString(txData))
}

export function isAccountBalanceRequest(data: unknown): data is AccountBalanceRequest {
  const { address, rpcUrl } = (data || {}) as AccountBalanceRequest

  return isAddress(address) && (!rpcUrl || isString(rpcUrl))
}
