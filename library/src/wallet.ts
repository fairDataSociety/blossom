import { ApiActions } from './constants/api-actions.enum'
import { BlossomMessages } from './messages/blossom-messages'

export class Wallet {
  constructor(private messages: BlossomMessages) {}

  /**
   * Returns account balance of current user in wei
   * @returns current balance in wei
   */
  public getUserBalance(): Promise<string> {
    return this.messages.sendMessage(ApiActions.GET_USER_BALANCE)
  }

  /**
   * Creates a transaction with current user as signer.
   * @param address receiver account
   * @param amount transaction amount in wei
   */
  public sendTransaction(address: string, amount: string): Promise<void> {
    return this.messages.sendMessage(ApiActions.SEND_TRANSACTION, { to: address, amount })
  }
}
