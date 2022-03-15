import BackgroundAction from '../../constants/background-actions.enum'

interface LoginData {
  username: string
  password: string
  gateway: string
}

export function login(username: string, password: string, gateway: string): Promise<void> {
  console.log('Logging in user', username)

  return Promise.resolve()
}

export default function handler(
  action: BackgroundAction,
  data: unknown,
  sender: chrome.runtime.MessageSender,
): Promise<unknown> {
  if (action === BackgroundAction.LOGIN) {
    const { username, password, gateway } = data as LoginData

    return login(username, password, gateway)
  }

  return null
}
