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
import { FdpStorageProvider } from '../../services/fdp-storage.provider'
import { Storage } from '../../services/storage/storage.service'
import { openTab } from '../../utils/tabs'
import { createMessageHandler } from './message-handler'

const fdpStorageProvider = new FdpStorageProvider()
const storage = new Storage()

export async function login({ username, password, network }: LoginData): Promise<void> {
  await storage.setNetwork(network)

  const fdp = await fdpStorageProvider.getService()

  await fdp.account.login(username, password)

  console.log(`auth.listener: Successfully logged in user ${username}`)
}

export async function register(data: RegisterData): Promise<void> {
  const { username, password, network } = data

  try {
    let wallet: Wallet

    await storage.setNetwork(network)

    if (isRegisterDataPrivateKey(data)) {
      wallet = new Wallet(data.privateKey)
    } else if (isRegisterDataMnemonic(data)) {
      wallet = Wallet.fromMnemonic(data.mnemonic)
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

export function openAuthPage(): Promise<void> {
  openTab('auth.html')

  return Promise.resolve()
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
  {
    action: BackgroundAction.OPEN_AUTH_PAGE,
    handler: openAuthPage,
  },
])

export default messageHandler
