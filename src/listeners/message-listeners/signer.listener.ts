import { Wallet } from 'ethers'
import BackgroundAction from '../../constants/background-actions.enum'
import { isString } from '../../messaging/message.asserts'
import { DappService } from '../../services/dapp.service'
import { Dialog } from '../../services/dialog.service'
import { SessionFdpStorageProvider } from '../../services/fdp-storage/session-fdp-storage.provider'
import { createMessageHandler } from './message-handler'

const dialogs = new Dialog()
const dappService = new DappService()
const fdpStorageProvider = new SessionFdpStorageProvider()

async function signMessage(message: string, sender: chrome.runtime.MessageSender): Promise<string> {
  const [fdp, dappId] = await Promise.all([
    fdpStorageProvider.getService(),
    dappService.getDappId(sender.url),
  ])

  if (!fdp) {
    throw new Error('Blossom: User is not logged in.')
  }

  const confirmed = await dialogs.ask('SIGN_MESSAGE_MESSAGE', { dappId, message })

  if (!confirmed) {
    throw new Error('Blossom: Access denied')
  }

  const wallet = new Wallet(fdp.account.wallet.privateKey)

  return wallet.signMessage(message)
}

const messageHandler = createMessageHandler([
  {
    action: BackgroundAction.SIGNER_SIGN_MESSAGE,
    assert: isString,
    handler: signMessage,
  },
])

export default messageHandler
