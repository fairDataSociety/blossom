import { Bytes } from '../model/general.types'
import { MemoryAccount } from '../model/storage/account.model'
import { Network } from '../model/storage/network.model'
import {
  aesEncyptSeedWithBytesKey,
  decryptSeedWithBytesKey,
  generateSalt,
  hashSeed,
  passwordToKey,
  wordsToWordArray,
} from '../utils/encryption'
import { Storage } from './storage/storage.service'

export class AccountService {
  private storage: Storage = new Storage()

  public async create(
    name: string,
    address: string,
    password: string,
    seed: Bytes<64>,
    network: Network,
  ): Promise<void> {
    const account = await this.storage.getAccount(name)

    if (account) {
      throw new Error('Account already exists')
    }

    await this.storage.setAccount({
      name,
      address,
      network,
      hash: hashSeed(seed).words,
      ...this.encryptSeed(seed, password),
    })
  }

  public async load(name: string, password: string): Promise<MemoryAccount> {
    const account = await this.storage.getAccount(name)

    if (!account) {
      throw new Error("Account doesn't exists")
    }

    const memoryAccount: MemoryAccount = account as unknown as MemoryAccount

    memoryAccount.seed = this.decryptSeed(account.seed, password, account.salt)

    if (hashSeed(memoryAccount.seed).toString() !== wordsToWordArray(memoryAccount.hash).toString()) {
      throw new Error('Incorrect password')
    }

    return memoryAccount
  }

  private encryptSeed(seed: Bytes<64>, password: string): { seed: string; salt: number[] } {
    const salt = generateSalt()

    return {
      seed: aesEncyptSeedWithBytesKey(seed, passwordToKey(password, salt)),
      salt: salt.words,
    }
  }

  private decryptSeed(seed: string, password: string, salt: number[]): Bytes<64> {
    return decryptSeedWithBytesKey(seed, passwordToKey(password, wordsToWordArray(salt)))
  }
}
