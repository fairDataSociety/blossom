import { ErrorCode } from '../constants/errors'
import { isSession } from '../messaging/message.asserts'
import { Address } from '../model/general.types'
import { Network } from '../model/storage/network.model'
import { Session } from '../model/storage/session.model'
import { Errors } from './error.service'
import { Storage } from './storage/storage.service'

export class SessionService {
  private storage: Storage = new Storage()
  private errors: Errors = new Errors()

  public async open(
    ensUserName: string,
    localUserName: string,
    address: Address,
    network: Network,
    seed: Uint8Array,
  ): Promise<void> {
    await this.removeGlobalError()

    return this.storage.setSession({
      ensUserName,
      localUserName,
      network,
      address,
      seed,
    })
  }

  public async load(): Promise<Session> {
    const session = await this.processSession(await this.storage.getSession())

    if (!session) {
      await this.setGlobalError()

      throw new Error('User is not logged in')
    }

    return session
  }

  public async close(): Promise<void> {
    await this.setGlobalError()

    return this.storage.deleteSession()
  }

  public onChange(listener: (session: Session) => void) {
    this.storage.onSessionChange(async (session: Session) => listener(await this.processSession(session)))
  }

  private async processSession(session: Session): Promise<Session> {
    if (!session) {
      await this.setGlobalError()

      return null
    }

    if (!isSession(session)) {
      this.storage.deleteSession()
      await this.setGlobalError()

      return null
    }

    await this.removeGlobalError()

    return session
  }

  private setGlobalError() {
    return this.errors.addGlobalError(ErrorCode.USER_NOT_LOGGED_IN)
  }

  private removeGlobalError() {
    return this.errors.removeGlobalError(ErrorCode.USER_NOT_LOGGED_IN)
  }
}
