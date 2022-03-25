import BackgroundAction from '../../constants/background-actions.enum'
import { NULL_ADDRESS } from '../../constants/constants'
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

export async function login(username: string, password: string): Promise<void> {
  console.log('Logging in user', username)

  const data = await etherService.getUserData(username)

  if ((data as any).addr === NULL_ADDRESS) {
    throw new Error(`auth.listener: Username ${username} doesn't exist`)
  }
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
