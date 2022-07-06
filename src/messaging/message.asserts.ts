import { Account } from '../model/general.types'
import {
  LoginData,
  RegisterData,
  RegisterDataBase,
  RegisterDataMnemonic,
  RegisterDataPrivateKey,
  UsernameCheckData,
} from '../model/internal-messages.model'

export function isLoginData(data: unknown): data is LoginData {
  const loginData = (data || {}) as LoginData

  return Boolean(loginData.username && loginData.password && loginData.network)
}

export function isRegisterData(data: unknown): data is RegisterData {
  return Boolean(isRegisterDataMnemonic(data) || isRegisterDataPrivateKey(data))
}

export function isRegisterDataMnemonic(data: unknown): data is RegisterDataMnemonic {
  const registerData = (data || {}) as RegisterDataMnemonic

  return Boolean(isRegisterDataBase(data) && registerData.mnemonic)
}

export function isRegisterDataPrivateKey(data: unknown): data is RegisterDataPrivateKey {
  const registerData = (data || {}) as RegisterDataPrivateKey

  return Boolean(isRegisterDataBase(data) && registerData.privateKey)
}

export function isRegisterDataBase(data: unknown): data is RegisterDataBase {
  const registerData = (data || {}) as RegisterDataBase

  return Boolean(registerData.username && registerData.password && registerData.network)
}

export function isAccount(data: unknown): data is Account {
  return typeof data === 'string' && data.startsWith('0x') && data.length === 42
}

export function isUsernameCheckData(data: unknown): data is UsernameCheckData {
  const usernameCheckData = (data || {}) as UsernameCheckData

  return Boolean(usernameCheckData.username && usernameCheckData.network)
}
