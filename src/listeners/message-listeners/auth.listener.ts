import BackgroundAction from '../../constants/background-actions.enum'
import { Ether } from '../../services/ether.service'

interface LoginData {
  username: string
  password: string
}

interface RegisterData {
  username: string
  password: string
}

const etherService = new Ether()

export function login(username: string, password: string): Promise<void> {
  console.log('Logging in user', username)

  return Promise.resolve()
}

export async function register(username: string, password: string): Promise<void> {
  await etherService.registerUsername(username)
}

export default function handler(
  action: BackgroundAction,
  data: unknown,
  sender: chrome.runtime.MessageSender,
): Promise<unknown> {
  if (action === BackgroundAction.LOGIN) {
    const { username, password } = data as LoginData
    return login(username, password)
  } else if (action === BackgroundAction.REGISTER) {
    const { username, password } = data as RegisterData
    return register(username, password)
  }

  return null
}
