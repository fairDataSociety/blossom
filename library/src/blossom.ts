import { ApiActions } from './constants/api-actions.enum'
import { Networks } from './constants/networks'
import { BlossomMessages } from './messages/blossom-messages'
import { createBlossomMessages } from './messages/blossom-messages.factory'

export class Blossom {
  private messages: BlossomMessages

  constructor(
    private network: Networks = Networks.localhost,
    extensionId = 'lbenhfaonefggjjgnajjepfjdcggkmbm',
  ) {
    this.messages = createBlossomMessages(extensionId)
  }

  public login(username: string, password: string): Promise<void> {
    return this.messages.sendMessage<void>(ApiActions.LOGIN, { username, password, rpc: this.network })
  }

  public register(username: string, password: string): Promise<void> {
    return this.messages.sendMessage<void>(ApiActions.REGISTER, { username, password, rpc: this.network })
  }
}
