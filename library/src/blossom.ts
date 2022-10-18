import { ApiActions } from './constants/api-actions.enum'
import { BlossomMessages } from './messages/blossom-messages'
import { createBlossomMessages } from './messages/blossom-messages.factory'
import { FdpStorage } from './model/fdp-storage.model'
import createFdpStorageProxy from './proxy/fdp-storage.proxy.factory'
import { Signer } from './signer'
import { getDappId } from './utils/dapp.util'

/**
 * Interface of the Blossom browser extension
 * This class can be used inside of a web page or service worker script
 */
export class Blossom {
  private messages: BlossomMessages
  /**
   * Proxy object for the FdpStorage type. Simulates access to FdpStorage functions by
   * forwarding requests to the Blossom extension.
   *
   * For more information about available functions check:
   * https://github.com/fairDataSociety/fdp-storage#usage
   */
  public readonly fdpStorage: FdpStorage

  /**
   * Signer object
   */
  public readonly signer: Signer

  /**
   * dApp ENS name. If dApp is loaded from an invalid URL, the value will be null.
   */
  public readonly dappId: string | null = getDappId()

  /**
   *
   * @param extensionId The Blossom extension ID
   */
  constructor(extensionId = 'caedjloenbhibmaeffockkiallpngmmd') {
    this.messages = createBlossomMessages(extensionId)
    this.fdpStorage = createFdpStorageProxy(this.messages)
    this.signer = new Signer(this.messages)
  }

  /**
   * Test function, to check communication with the extension
   * @param data Any data
   * @returns The same data
   */
  public echo<Data>(data: Data): Promise<Data> {
    return this.messages.sendMessage<Data>(ApiActions.ECHO, data)
  }

  public closeConnection() {
    this.messages.closeConnection()
  }
}
