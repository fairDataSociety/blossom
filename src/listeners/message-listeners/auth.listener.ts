import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { Wallet } from 'ethers'
import BackgroundAction from '../../constants/background-actions.enum'
import {
  isLoginData,
  isRegisterData,
  isRegisterDataMnemonic,
  isRegisterDataPrivateKey,
  isUsernameCheckData,
} from '../../messaging/message.asserts'
import {
  LoginData,
  RegisterData,
  RegisterResponse,
  UsernameCheckData,
} from '../../model/internal-messages.model'
import { createMessageHandler } from './message-handler'

// TODO should be configurable
const fdp = new FdpStorage('http://localhost:1633', 'http://localhost:1635')

export async function login({ username, password }: LoginData): Promise<void> {
  await fdp.account.login(username, password)

  console.log(`auth.listener: Successfully logged in user ${username}`)
}

export async function register(data: RegisterData): Promise<void> {
  const { username, password } = data

  try {
    let wallet: Wallet

    if (isRegisterDataPrivateKey(data)) {
      wallet = new Wallet(data.privateKey)
    } else if (isRegisterDataMnemonic(data)) {
      wallet = Wallet.fromMnemonic(data.mnemonic)
    } else {
      throw new Error('Private key or mnemonic must be set in order to register account')
    }

    fdp.account.setActiveAccount(wallet)

    await fdp.account.register(username, password)

    console.log(`auth.listener: Successfully registered user ${username}`)

    return Promise.resolve()
  } catch (error) {
    console.error(`auth.listener: Error while trying to register new user ${username}`, error)
    throw error
  }
}

export function isUsernameAvailable({ username }: UsernameCheckData): Promise<boolean> {
  return fdp.ens.isUsernameAvailable(username)
}

export async function generateWallet(): Promise<RegisterResponse> {
  try {
    const wallet = Wallet.createRandom()
    const account = await wallet.getAddress()

    return {
      account,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
    }
  } catch (error) {
    console.error(`auth.listeer: Couldn't generate mnemonic`, error)
    throw error
  }
}

const messageHandler = createMessageHandler([
  {
    action: BackgroundAction.LOGIN,
    assert: isLoginData,
    handler: login,
  },
  {
    action: BackgroundAction.REGISTER,
    assert: isRegisterData,
    handler: register,
  },
  {
    action: BackgroundAction.CHECK_USERNAME,
    assert: isUsernameCheckData,
    handler: isUsernameAvailable,
  },
  {
    action: BackgroundAction.GENERATE_WALLET,
    assert: null,
    handler: generateWallet,
  },
])

export default messageHandler
