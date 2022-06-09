import { BigNumber } from 'ethers'
import BackgroundAction from '../constants/background-actions.enum'
import { Account } from '../model/general.types'
import { LoginData, RegisterData, RegisterResponse } from '../model/internal-messages.model'
import { LocaleData } from '../services/locales.service'
import { sendMessage } from './scripts.messaging'

export function login(data: LoginData): Promise<void> {
  return sendMessage<LoginData, void>(BackgroundAction.LOGIN, data)
}

export function register(data: RegisterData): Promise<RegisterResponse> {
  return sendMessage<RegisterData, RegisterResponse>(BackgroundAction.REGISTER, data)
}

export function generateWallet(): Promise<RegisterResponse> {
  return sendMessage<void, RegisterResponse>(BackgroundAction.GENERATE_WALLET)
}

export function getLocales(): Promise<LocaleData> {
  return sendMessage<void, LocaleData>(BackgroundAction.GET_LOCALES)
}

export async function getAccountBalance(account: Account): Promise<BigNumber> {
  const { hex } = await sendMessage<Account, { hex: string }>(BackgroundAction.GET_BALANCE, account)

  return BigNumber.from(hex)
}

export function echo<Data>(data: Data): Promise<Data> {
  return sendMessage<Data, Data>(BackgroundAction.ECHO, data)
}
