import { Wallet } from 'ethers'
import BackgroundAction from '../../constants/background-actions.enum'
import { isLoginData, isRegisterData, isUsernameCheckData } from '../../messaging/message.asserts'
import {
  LoginData,
  RegisterData,
  RegisterResponse,
  UsernameCheckData,
} from '../../model/internal-messages.model'
import { FdpStorageProvider } from '../../services/fdp-storage.provider'
import { createMessageHandler } from './message-handler'

const fdpStorageProvider = new FdpStorageProvider()

export async function login({ username, password }: LoginData): Promise<void> {
  const fdp = await fdpStorageProvider.getService()

  await fdp.account.login(username, password)

  console.log(`auth.listener: Successfully logged in user ${username}`)
}

export async function register({ username, password, privateKey, mnemonic }: RegisterData): Promise<void> {
  try {
    let wallet: Wallet

    if (privateKey) {
      wallet = new Wallet(privateKey)
    } else if (mnemonic) {
      wallet = Wallet.fromMnemonic(mnemonic)
    } else {
      throw new Error('Private key or mnemonic must be set in order to register account')
    }

    const fdp = await fdpStorageProvider.getService()

    fdp.account.setActiveAccount(wallet)

    await fdp.account.register(username, password)

    console.log(`auth.listener: Successfully registered user ${username}`)

    return Promise.resolve()
  } catch (error) {
    console.error(`auth.listener: Error while trying to register new user ${username}`, error)
    throw error
  }
}

export async function isUsernameAvailable({ username }: UsernameCheckData): Promise<boolean> {
  const fdp = await fdpStorageProvider.getService()

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
