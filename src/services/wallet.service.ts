import { errorMessages } from '../constants/errors'
import { ListenerHandler } from '../listeners/message-listeners/message-handler'
import { SessionService } from './session.service'
import { Storage } from './storage/storage.service'

export class WalletService {
  private session = new SessionService()
  private storage = new Storage()

  public async updateLock(): Promise<void> {
    const { lockInterval } = await this.getWalletLockData()

    return this.setLock(lockInterval)
  }

  public async isLocked(): Promise<boolean> {
    const { lockInterval, lockStart } = await this.getWalletLockData()

    return this.isWalletLocked(lockInterval, lockStart)
  }

  private async getWalletLockData(): Promise<{ lockInterval: number; lockStart: number }> {
    const { ensUserName, localUserName } = await this.session.load()

    const [{ lockInterval }, { lockStart }] = await Promise.all([
      this.storage.getWalletConfig(ensUserName || localUserName),
      this.storage.getGeneral(),
    ])

    return { lockInterval, lockStart }
  }

  public createWalletLockInterceptor(handler: ListenerHandler<unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    return async (data: unknown, sender: chrome.runtime.MessageSender) => {
      const { lockInterval, lockStart } = await self.getWalletLockData()

      if (self.isWalletLocked(lockInterval, lockStart)) {
        throw new Error(errorMessages.WALLET_LOCKED)
      }

      await self.setLock(lockInterval)

      return handler(data, sender)
    }
  }

  private isWalletLocked(lockInterval: number, lockStart: number): boolean {
    if (!lockInterval) {
      return false
    }

    return Boolean(!lockStart || new Date().getTime() >= lockStart)
  }

  public setLock(lockInterval: number): Promise<void> {
    return this.storage.updateGeneral({ lockStart: new Date(new Date().getTime() + lockInterval).getTime() })
  }
}
