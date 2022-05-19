import { BlossomMessages } from './messages/blossom-messages'
import { createBlossomMessages } from './messages/blossom-messages.factory'

export class Blossom {
  private messages: BlossomMessages

  constructor(extensionId = 'lbenhfaonefggjjgnajjepfjdcggkmbm') {
    this.messages = createBlossomMessages(extensionId)
  }

  public login(username: string, password: string): Promise<void> {
    return this.messages.sendMessge<void>('login', { username, password })
  }
}
