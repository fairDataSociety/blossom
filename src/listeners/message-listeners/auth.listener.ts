import BackgroundAction from '../../constants/background-actions.enum'
import { NULL_ADDRESS } from '../../constants/constants'
import { Bee } from '../../services/bee.service'
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
const bee = new Bee(process.env.SWARM_EXTENSION_ID)

export async function login(username: string, password: string): Promise<void> {
  console.log('Logging in user', username)

  const data = await etherService.getUserData(username)

  if ((data as any).addr === NULL_ADDRESS) {
    throw new Error(`auth.listener: Username ${username} doesn't exist`)
  }
}

export async function register(username: string, password: string): Promise<void> {
  try {
    await etherService.registerUsername(username)

    // TODO Get batch ID
    const batchId = 'ddb50acc0d03ae68a00c89e967e319bf73b726005865d76454864804082dd690'

    const signerProvider = etherService.getSignerProvider()
    await bee.createFeed(
      username,
      batchId,
      password,
      signerProvider.getPublicKey(),
      signerProvider.getSigner(),
    )
    console.log(`auth.listener: Successfully registered user ${username}`)
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
    const { username, password } = data as LoginData

    return login(username, password)
  } else if (action === BackgroundAction.REGISTER) {
    const { username, password } = data as RegisterData

    return register(username, password)
  }

  return null
}
