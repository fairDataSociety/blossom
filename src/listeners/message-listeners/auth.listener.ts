import BackgroundAction from '../../constants/background-actions.enum'
import { Network } from '../../constants/networks'
import { generateMnemonic } from '../../utils/ethers'

interface LoginData {
  username: string
  password: string
  network: Network
}

interface RegisterData {
  username: string
  password: string
}

export function login(username: string, password: string, network: Network): Promise<void> {
  console.log('Logging in user', username)

  return Promise.resolve()
}

export function register(username: string, password: string): Promise<void> {
  try {
    console.log(`auth.listener: Successfully registered user ${username}`)

    return Promise.resolve()
  } catch (error) {
    console.error(`auth.listeer: Error while trying to register new user ${username}`, error)
    throw error
  }
}

export default function handler(
  action: BackgroundAction,
  data: unknown,
  sender: chrome.runtime.MessageSender,
): Promise<unknown> {
  if (action === BackgroundAction.LOGIN) {
    const { username, password, network } = data as LoginData

    return login(username, password, network)
  } else if (action === BackgroundAction.REGISTER) {
    const { username, password } = data as RegisterData

    return register(username, password)
  } else if (action === BackgroundAction.GENERATE_MNEMONIC) {
    return Promise.resolve(generateMnemonic())
  }

  return null
}
