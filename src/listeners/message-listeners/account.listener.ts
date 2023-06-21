import { BigNumber, providers } from 'ethers'
import BackgroundAction from '../../constants/background-actions.enum'
import { isTransaction } from '../../messaging/message.asserts'
import { createMessageHandler } from './message-handler'
import { Blockchain } from '../../services/blockchain.service'
import { AccountBalanceRequest, Transaction } from '../../model/internal-messages.model'
import { SessionFdpStorageProvider } from '../../services/fdp-storage/session-fdp-storage.provider'
import { isInternalMessage } from '../../utils/extension'
import { Dialog } from '../../services/dialog.service'
import { getDappId } from './listener.utils'
import { errorMessages } from '../../constants/errors'
import { isAccountBalanceRequest } from '../../messaging/message.asserts'

const dialogs = new Dialog()
const blockchain = new Blockchain()
const fdpStorageProvider = new SessionFdpStorageProvider()

export async function getAccountBalance({ address, rpcUrl }: AccountBalanceRequest): Promise<string> {
  const balance = await blockchain.getAccountBalance(address, rpcUrl)

  return balance.toString()
}

export async function getUserAccountBalance(): Promise<string> {
  const fdp = await fdpStorageProvider.getService()

  const balance = await blockchain.getAccountBalance(fdp.account.wallet.address)

  return balance.toString()
}

export async function sendTransaction(
  { to, amount }: Transaction,
  sender: chrome.runtime.MessageSender,
): Promise<providers.TransactionReceipt> {
  const fdp = await fdpStorageProvider.getService()

  const { wallet } = fdp.account

  if (!isInternalMessage(sender)) {
    const dappId = await getDappId(sender)
    const confirmed = await dialogs.ask('DIALOG_DAPP_TRANSACTION', { dappId, to, amount })

    if (!confirmed) {
      throw new Error(errorMessages.ACCESS_DENIED)
    }
  }

  return blockchain.sendTransaction(wallet.privateKey, to, BigNumber.from(amount))
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
    action: BackgroundAction.SEND_TRANSACTION,
    assert: isTransaction,
    handler: sendTransaction,
  },
])

export default messageHandler
