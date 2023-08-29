import { Wallet } from 'ethers'
import BackgroundAction from '../../constants/background-actions.enum'
import {
  isImportAccountData,
  isLocalLoginData,
  isLoginData,
  isRegisterData,
  isRegisterDataMnemonic,
  isUsernameCheckData,
} from '../../messaging/message.asserts'
import {
  AccountResponse,
  ImportAccountData,
  LocalLoginData,
  LoginData,
  RegisterData,
  RegisterResponse,
  UserInfo,
  UsernameCheckData,
  UserResponse,
} from '../../model/internal-messages.model'
import { AccountService } from '../../services/account.service'
import { SessionlessFdpStorageProvider } from '../../services/fdp-storage/sessionless-fdp-storage.provider'
import { SessionService } from '../../services/session.service'
import { Storage } from '../../services/storage/storage.service'
import { openTab } from '../../utils/tabs'
import { createMessageHandler } from './message-handler'
import { getDappId } from './listener.utils'
import { Dialog } from '../../services/dialog.service'
import { errorMessages } from '../../constants/errors'

let fdpStorageProvider = new SessionlessFdpStorageProvider()
const storage = new Storage()
const dialogs = new Dialog()
const session = new SessionService()
const account = new AccountService()

export async function login({ username, password, network }: LoginData): Promise<void> {
  await storage.setNetwork(network)

  const fdp = await fdpStorageProvider.getService()

  await fdp.account.login(username, password)

  await session.open(username, null, password, fdp.account.wallet.address, network, fdp.account.seed)

  console.log(`auth.listener: Successfully logged in user ${username}`)
}

export async function localLogin({ name, password, network }: LocalLoginData): Promise<void> {
  const { address, seed } = await account.load(name, password)

  const fdp = await fdpStorageProvider.getService()

  try {
    fdp.account.setAccountFromSeed(seed)

    if (address !== fdp.account.wallet.address) {
      throw new Error('Incorrect password')
    }
  } catch (error) {
    fdpStorageProvider = new SessionlessFdpStorageProvider()

    throw error
  }

  await session.open(null, name, password, address, network, seed)

  await storage.updateAccount(name, { network })

  console.log(`auth.listener: Successfully logged in with local account ${name}`)
}

export async function importAccount({ name, password, mnemonic, network }: ImportAccountData): Promise<void> {
  await storage.setNetwork(network)

  const fdp = await fdpStorageProvider.getService()

  try {
    Wallet.fromMnemonic(mnemonic)
  } catch (error) {
    throw new Error('Invalid mnemonic')
  }

  try {
    fdp.account.setAccountFromMnemonic(mnemonic)

    const { wallet, seed } = fdp.account

    await account.create(name, wallet.address, password, seed, network)

    await session.open(null, name, password, wallet.address, network, seed)

    console.log(`auth.listener: Successfully imported account ${name}`)
  } catch (error) {
    fdpStorageProvider = new SessionlessFdpStorageProvider()

    throw error
  }
}

export async function register(data: RegisterData): Promise<void> {
  const { username, password, network } = data

  try {
    await storage.setNetwork(network)

    const fdp = await fdpStorageProvider.getService()

    if (isRegisterDataMnemonic(data)) {
      fdp.account.setAccountFromMnemonic(data.mnemonic)
    } else {
      throw new Error('Private key or mnemonic must be set in order to register account')
    }

    await fdp.account.register(username, password)

    session.open(username, null, password, fdp.account.wallet.address, network, fdp.account.seed)

    console.log(`auth.listener: Successfully registered user ${username}`)
  } catch (error) {
    console.error(`auth.listener: Error while trying to register new user ${username}`, error)
    throw error
  }
}

export async function isUsernameAvailable({ username, network }: UsernameCheckData): Promise<boolean> {
  await storage.setNetwork(network)

  const fdp = await fdpStorageProvider.getService()

  return fdp.ens.isUsernameAvailable(username)
}

export async function generateWallet(): Promise<RegisterResponse> {
  try {
    const wallet = Wallet.createRandom()
    const address = await wallet.getAddress()

    return {
      address,
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

export async function getCurrentUser(): Promise<UserResponse> {
  let sessionData

  try {
    sessionData = await session.load()
  } catch (error) {
    return null
  }

  const { ensUserName, localUserName, address, network } = sessionData

  return {
    ensUserName,
    localUserName,
    address,
    network,
  }
}

export async function getLocalAccounts(): Promise<AccountResponse[]> {
  const accounts = await storage.getAllAccounts()

  return accounts.map(({ name, address, network }) => ({
    name,
    address,
    network,
  }))
}

export function logout(): Promise<void> {
  return session.close()
}

export async function getUserInfo(data, sender: chrome.runtime.MessageSender): Promise<UserInfo> {
  const [sessionData, dappId] = await Promise.all([session.load(), getDappId(sender)])

  const dapp = await storage.getDappBySession(dappId, sessionData)

  if (!dapp.accountInfoAccess) {
    const confirmed = await dialogs.ask('DIALOG_DAPP_ACCOUNT_INFO', { dappId })

    if (!confirmed) {
      throw new Error(errorMessages.ACCESS_DENIED)
    }

    await storage.updateDappBySession(dappId, { accountInfoAccess: true }, sessionData)
  }

  const { ensUserName: ensName, address } = sessionData

  return {
    ensName,
    address,
  }
}

const messageHandler = createMessageHandler([
  {
    action: BackgroundAction.LOGIN,
    assert: isLoginData,
    handler: login,
  },
  {
    action: BackgroundAction.LOCAL_LOGIN,
    assert: isLocalLoginData,
    handler: localLogin,
  },
  {
    action: BackgroundAction.IMPORT_ACCOUNT,
    assert: isImportAccountData,
    handler: importAccount,
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
  {
    action: BackgroundAction.GET_CURRENT_USER,
    handler: getCurrentUser,
  },
  {
    action: BackgroundAction.GET_LOCAL_ACCOUNTS,
    handler: getLocalAccounts,
  },
  {
    action: BackgroundAction.LOGOUT,
    handler: logout,
  },
  {
    action: BackgroundAction.GET_USER_INFO,
    handler: getUserInfo,
  },
])

export default messageHandler
