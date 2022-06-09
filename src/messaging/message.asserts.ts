import { Account } from '../model/general.types'
import { LoginData, RegisterData } from '../model/internal-messages.model'

export function isLoginData(data: unknown): data is LoginData {
  const loginData = (data || {}) as LoginData

  return Boolean(loginData.username && loginData.password && loginData.network)
}

export function isRegisterData(data: unknown): data is RegisterData {
  const registerData = (data || {}) as RegisterData

  return Boolean(registerData.username && registerData.password)
}

export function isAccount(data: unknown): data is Account {
  return typeof data === 'string' && data.startsWith('0x') && data.length === 42
}
