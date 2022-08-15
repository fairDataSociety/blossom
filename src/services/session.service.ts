import AES from 'crypto-js/aes'
import encUtf8 from 'crypto-js/enc-utf8'
import { isSession } from '../messaging/message.asserts'
import { Account, PrivateKey } from '../model/general.types'
import { Network } from '../model/storage/network.model'
import { KeyData, Session } from '../model/storage/session.model'
import { removeWarningBadge, setWarningBadge } from '../utils/extension'
import { generateRandomString } from '../utils/random'
import { Storage } from './storage/storage.service'

export class SessionService {
  private storage: Storage = new Storage()

  public async open(
    username: string,
    account: Account,
    network: Network,
    privateKey: PrivateKey,
  ): Promise<void> {
    const key = await this.encryptKey(privateKey)

    removeWarningBadge()

    return this.storage.setSession({
      username,
      network,
      account,
      key,
    })
  }

  public async load(): Promise<Session> {
    const session = await this.storage.getSession()

    return this.processSession(session)
  }

  public close(): Promise<void> {
    setWarningBadge()

    return this.storage.deleteSession()
  }

  public onChange(listener: (session: Session) => void) {
    this.storage.onSessionChange(async (session: Session) => listener(await this.processSession(session)))
  }

  private async processSession(session: Session): Promise<Session> {
    if (!session) {
      setWarningBadge()

      return null
    }

    if (!isSession(session)) {
      this.storage.deleteSession()
      setWarningBadge()

      return null
    }

    session.key.privateKey = await this.decryptKey(session)

    if (!session.key.privateKey) {
      this.storage.deleteSession()
      setWarningBadge()

      return null
    }

    removeWarningBadge()

    return session
  }

  private async encryptKey(privateKey: PrivateKey): Promise<KeyData> {
    const sessionKey = generateRandomString(48)
    const url = this.generateRandomUrl()

    const encryptedPrivateKey = AES.encrypt(privateKey, sessionKey).toString()

    await chrome.cookies.set({
      url,
      name: generateRandomString(10),
      value: sessionKey,
      secure: true,
    })

    return {
      privateKey: encryptedPrivateKey,
      url,
    }
  }

  private async decryptKey(session: Session): Promise<PrivateKey> {
    const {
      key: { privateKey: encryptedKey, url },
    } = session || { key: {} }

    if (!encryptedKey || !url) {
      return
    }

    const [{ value: sessionKey }] = await chrome.cookies.getAll({
      url,
    })

    if (!sessionKey) {
      this.storage.deleteSession()

      return
    }

    return AES.decrypt(encryptedKey, sessionKey).toString(encUtf8)
  }

  private generateRandomUrl(): string {
    return `https://www.${generateRandomString(50)}.com`
  }
}
