import { BigNumber, providers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import BackgroundAction from '../../constants/background-actions.enum'
import {
  isInternalTransaction,
  isString,
  isTransaction,
  isWalletConfig,
} from '../../messaging/message.asserts'
import { createMessageHandler } from './message-handler'
import { Blockchain } from '../../services/blockchain.service'
import { AccountBalanceRequest, InternalTransaction, Transaction } from '../../model/internal-messages.model'
import { SessionFdpStorageProvider } from '../../services/fdp-storage/session-fdp-storage.provider'
import { Dialog } from '../../services/dialog.service'
import { getDappId } from './listener.utils'
import { errorMessages } from '../../constants/errors'
import { isAccountBalanceRequest } from '../../messaging/message.asserts'
import { Address, BigNumberString } from '../../model/general.types'
import { Storage } from '../../services/storage/storage.service'
import { SessionService } from '../../services/session.service'
import { Transactions, WalletConfig } from '../../model/storage/wallet.model'
import { WalletService } from '../../services/wallet.service'

const dialogs = new Dialog()
const storage = new Storage()
const session = new SessionService()
const blockchain = new Blockchain()
const wallet = new WalletService()
const fdpStorageProvider = new SessionFdpStorageProvider()

function saveTransaction(
  transaction: Transaction | InternalTransaction,
  transactionContent: providers.TransactionReceipt,
  accountName: string,
  networkLabel: string,
): Promise<void> {
  return storage.addWalletTransaction(
    {
      id: uuidv4(),
      time: new Date().getTime(),
      direction: 'sent',
      content: {
        from: transactionContent.from,
        to: transactionContent.to,
        value: transaction.value,
        data: transaction.data,
        gas: transactionContent.gasUsed.toString(),
        gasPrice: transactionContent.effectiveGasPrice.toString(),
      },
    },
    accountName,
    networkLabel,
    'regular',
  )
}

export async function getAccountBalance({ address, rpcUrl }: AccountBalanceRequest): Promise<string> {
  const balance = await new Blockchain(rpcUrl).getAccountBalance(address)

  return balance.toString()
}

export async function getUserAccountBalance(): Promise<string> {
  const fdp = await fdpStorageProvider.getService()

  const balance = await blockchain.getAccountBalance(fdp.account.wallet.address)

  return balance.toString()
}

export async function sendTransactionInternal(
  transaction: InternalTransaction,
): Promise<providers.TransactionReceipt> {
  const { to, value, rpcUrl } = transaction
  const [fdp, { ensUserName, localUserName }, networks] = await Promise.all([
    fdpStorageProvider.getService(),
    session.load(),
    storage.getNetworkList(),
  ])

  const network = networks.find(({ rpc }) => rpc === rpcUrl)

  if (!network) {
    throw new Error('RPC URL is not allowed')
  }

  const { wallet } = fdp.account

  const transactionContent = await new Blockchain(rpcUrl).sendTransaction(
    wallet.privateKey,
    to,
    BigNumber.from(value),
  )

  await saveTransaction(transaction, transactionContent, ensUserName || localUserName, network.label)

  return transactionContent
}

export async function sendTransaction(
  transaction: InternalTransaction,
  sender: chrome.runtime.MessageSender,
): Promise<providers.TransactionReceipt> {
  const { to, value } = transaction
  const [fdp, { ensUserName, localUserName, network }] = await Promise.all([
    fdpStorageProvider.getService(),
    session.load(),
  ])

  const { wallet } = fdp.account

  const dappId = await getDappId(sender)
  const confirmed = await dialogs.ask('DIALOG_DAPP_TRANSACTION', { dappId, to, amount: value })

  if (!confirmed) {
    throw new Error(errorMessages.ACCESS_DENIED)
  }

  const transactionContent = await blockchain.sendTransaction(wallet.privateKey, to, BigNumber.from(value))

  await saveTransaction(transaction, transactionContent, ensUserName || localUserName, network.label)

  return transactionContent
}

export async function estimateGasPrice(transaction: InternalTransaction): Promise<BigNumberString> {
  const gasEstimation = await new Blockchain(transaction.rpcUrl).estimateGas(transaction)

  return gasEstimation.toString()
}

export async function getWalletTransactions(networkLabel: string): Promise<Transactions> {
  const { ensUserName, localUserName } = await session.load()

  return storage.getWalletTransactions(ensUserName || localUserName, networkLabel)
}

export async function clearWalletData(): Promise<void> {
  const { ensUserName, localUserName } = await session.load()

  return storage.clearWalletTransactions(ensUserName || localUserName)
}

export async function getWalletContacts(): Promise<Address[]> {
  const { ensUserName, localUserName, network } = await session.load()

  const { accounts } = await storage.getWalletData(ensUserName || localUserName, network.label)

  return Object.keys(accounts)
}

export async function getWalletConfig(): Promise<WalletConfig> {
  const { ensUserName, localUserName } = await session.load()

  return storage.getWalletConfig(ensUserName || localUserName)
}

export async function setWalletConfig(config: WalletConfig): Promise<void> {
  const { ensUserName, localUserName } = await session.load()

  return storage.setWalletConfig(ensUserName || localUserName, config)
}

export function isWalletLockedHandler(): Promise<boolean> {
  return wallet.isLocked()
}

export async function unlockWallet(password: string): Promise<void> {
  const { password: sessionPassword } = await session.load()

  if (sessionPassword !== password) {
    throw new Error('Invalid password')
  }

  await wallet.updateLock()
}

const messageHandler = createMessageHandler([
  {
    action: BackgroundAction.GET_BALANCE,
    assert: isAccountBalanceRequest,
    handler: getAccountBalance,
  },
  {
    action: BackgroundAction.GET_USER_BALANCE,
    handler: getUserAccountBalance,
  },
  {
    action: BackgroundAction.SEND_TRANSACTION_INTERNAL,
    assert: isInternalTransaction,
    handler: wallet.creatteWalletLockInterceptor(sendTransactionInternal),
  },
  {
    action: BackgroundAction.SEND_TRANSACTION,
    assert: isTransaction,
    handler: sendTransaction,
  },
  {
    action: BackgroundAction.ESTIMATE_GAS_PRICE,
    assert: isTransaction,
    handler: estimateGasPrice,
  },
  {
    action: BackgroundAction.GET_WALLET_TRANSACTIONS,
    handler: getWalletTransactions,
  },
  {
    action: BackgroundAction.CLEAR_WALLET_DATA,
    handler: clearWalletData,
  },
  {
    action: BackgroundAction.GET_WALLET_CONTACTS,
    handler: getWalletContacts,
  },
  {
    action: BackgroundAction.GET_WALLET_CONFIG,
    handler: getWalletConfig,
  },
  {
    action: BackgroundAction.SET_WALLET_CONFIG,
    assert: isWalletConfig,
    handler: setWalletConfig,
  },
  {
    action: BackgroundAction.IS_WALLET_LOCKED,
    handler: isWalletLockedHandler,
  },
  {
    action: BackgroundAction.UNLOCK_WALLET,
    assert: isString,
    handler: unlockWallet,
  },
  {
    action: BackgroundAction.REFRESH_WALLET_LOCK,
    handler: wallet.creatteWalletLockInterceptor(() => Promise.resolve()),
  },
])

export default messageHandler
