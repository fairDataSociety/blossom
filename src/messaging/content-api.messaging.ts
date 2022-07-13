import { BigNumber } from 'ethers'
import BackgroundAction from '../constants/background-actions.enum'
import { Account } from '../model/general.types'
import {
  LoginData,
  NetworkEditData,
  RegisterData,
  RegisterResponse,
  UsernameCheckData,
} from '../model/internal-messages.model'
import { Network } from '../model/storage/network.model'
import { Swarm } from '../model/storage/swarm.model'
import { LocaleData } from '../services/locales.service'
import { sendMessage } from './scripts.messaging'

export function login(data: LoginData): Promise<void> {
  return sendMessage<LoginData, void>(BackgroundAction.LOGIN, data)
}

export function register(data: RegisterData): Promise<RegisterResponse> {
  return sendMessage<RegisterData, RegisterResponse>(BackgroundAction.REGISTER, data)
}

export function isUsernameAvailable(data: UsernameCheckData): Promise<boolean> {
  return sendMessage<UsernameCheckData, boolean>(BackgroundAction.CHECK_USERNAME, data)
}

export function generateWallet(): Promise<RegisterResponse> {
  return sendMessage<void, RegisterResponse>(BackgroundAction.GENERATE_WALLET)
}

export function openAuthPage(): Promise<void> {
  return sendMessage<void, void>(BackgroundAction.OPEN_AUTH_PAGE)
}

export function getLocales(): Promise<LocaleData> {
  return sendMessage<void, LocaleData>(BackgroundAction.GET_LOCALES)
}

export async function getAccountBalance(account: Account): Promise<BigNumber> {
  const { hex } = await sendMessage<Account, { hex: string }>(BackgroundAction.GET_BALANCE, account)

  return BigNumber.from(hex)
}

export function getNetworkList(): Promise<Network[]> {
  return sendMessage<void, Network[]>(BackgroundAction.SETTINGS_GET_NETWORK_LIST)
}

export function addNetwork(network: Network): Promise<void> {
  return sendMessage<Network, void>(BackgroundAction.SETTINGS_ADD_NETWORK, network)
}

export function editNetwork(label: string, network: Network): Promise<void> {
  return sendMessage<NetworkEditData, void>(BackgroundAction.SETTINGS_EDIT_NETWORK, { label, network })
}

export function deleteNetwork(network: Network): Promise<void> {
  return sendMessage<Network, void>(BackgroundAction.SETTINGS_DELETE_NETWORK, network)
}

export function getSwarmSettings(): Promise<Swarm> {
  return sendMessage<void, Swarm>(BackgroundAction.SETTINGS_GET_SWARM)
}

export function setSwarmSettings(swarm: Swarm): Promise<void> {
  return sendMessage<Swarm, void>(BackgroundAction.SETTINGS_SET_SWARM, swarm)
}

export function echo<Data>(data: Data): Promise<Data> {
  return sendMessage<Data, Data>(BackgroundAction.ECHO, data)
}
