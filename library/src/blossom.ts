import { ApiActions } from './constants/api-actions.enum'
import { Networks } from './constants/networks'
import { BlossomMessages } from './messages/blossom-messages'
import { createBlossomMessages } from './messages/blossom-messages.factory'

/**
 * Interface of the Blossom browser extension
 * This class can be used inside of a web page or service worker script
 */
export class Blossom {
  private messages: BlossomMessages

  /**
   *
   * @param network One of the available networks to connect to
   * @param extensionId The Blossom extension ID
   */
  constructor(
    private network: Networks = Networks.localhost,
    extensionId = 'lbenhfaonefggjjgnajjepfjdcggkmbm',
  ) {
    this.messages = createBlossomMessages(extensionId)
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
