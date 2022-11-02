import { Wallet } from 'ethers'
import BackgroundAction from '../../constants/background-actions.enum'
import { isSignerRequest } from '../../messaging/message.asserts'
import { SignerRequest } from '../../model/internal-messages.model'
import { DappService } from '../../services/dapp.service'
import { Dialog } from '../../services/dialog.service'
import { SessionFdpStorageProvider } from '../../services/fdp-storage/session-fdp-storage.provider'
import { isOtherExtension } from '../../utils/extension'
import { createMessageHandler } from './message-handler'

const dialogs = new Dialog()
const dappService = new DappService()
const fdpStorageProvider = new SessionFdpStorageProvider()

async function signMessage(
  { podName, message }: SignerRequest,
  sender: chrome.runtime.MessageSender,
): Promise<string> {
  const fdp = await fdpStorageProvider.getService()

  if (!fdp) {
    throw new Error('Blossom: User is not logged in.')
  }

  const dappId = await dappService.getDappIdFromSender(sender)

  // TODO should check permissions
  if (podName !== dappId) {
    throw new Error('Blossom: Access denied')
  }

  const podWallet = await fdp.personalStorage.getPodWallet(fdp.account.seed, podName)

  if (!podWallet) {
    throw new Error("Blossom: pod doesn't exist")
  }

  const confirmed = await dialogs.ask(
    isOtherExtension(sender) ? 'EXTENSION_SIGN_MESSAGE_MESSAGE' : 'DAPP_SIGN_MESSAGE_MESSAGE',
    { dappId, message },
  )

  if (!confirmed) {
    throw new Error('Blossom: Access denied')
  }

  return new Wallet(podWallet.privateKey).signMessage(message)
}

const messageHandler = createMessageHandler([
  {
    action: BackgroundAction.SIGNER_SIGN_MESSAGE,
    assert: isSignerRequest,
    handler: signMessage,
  },
])

export default messageHandler
