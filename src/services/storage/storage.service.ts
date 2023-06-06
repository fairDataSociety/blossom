import { Network } from '../../model/storage/network.model'
import { Swarm } from '../../model/storage/swarm.model'
import { MemorySession, StorageSession } from '../../model/storage/session.model'
import { removeAllValues } from '../../utils/array'
import {
  sessionFactory,
  networkFactory,
  networkListFactory,
  swarmFactory,
  dappsFactory,
  accountsFactory,
  dappFactory,
  accountDappsFactory,
  generalFactory,
} from './storage-factories'
import { DappId } from '../../model/general.types'
import { AccountDapps, Dapp, Dapps, PodPermission } from '../../model/storage/dapps.model'
import { StorageAccount, Accounts } from '../../model/storage/account.model'
import { General } from '../../model/storage/general.model'

/**
 * Sets any value to the extension storage
 * @param key entry's key
 * @param value any value
 * @returns promise
 */
export function setEntry<T>(key: string, value: T): Promise<void> {
  return chrome.storage.local.set({ [key]: value })
}

/**
 * Retreives value of provided key from the extension storage
 * @param key entry's key
 * @returns value from the extension storage
 */
export async function getEntry<T>(key: string): Promise<T> {
  const data = await chrome.storage.local.get([key])

  return data[key] as T
}

/**
 * Deletes value from the extension storage
 * @param key entry's key
 * @returns promise
 */
export function deleteEntry(key: string): Promise<void> {
  return chrome.storage.local.remove([key])
}

/**
 * Stores an object to the extension storage.
 * The new object is merged to the existing one. Only shallow marge is performed.
 * @param key entry's key
 * @param object object to store
 * @returns promise
 */
export async function updateObject<T extends object>(key: string, object: T): Promise<void> {
  const existingObject = await getObject<T>(key, () => ({} as T))

  return setEntry<T>(key, { ...existingObject, ...object })
}

/**
 * Retreives object from the extension storage
 * @param key entry's key
 * @param factory function that creates default object if it is not found
 * @returns object from the extension storage or an object with default values
 */
export async function getObject<T extends object>(
  key: string,
  factory: () => T = () => {
    throw new Error('A factory function must be provided')
  },
): Promise<T> {
  const object = await getEntry<T>(key)

  return typeof object === 'object' ? object : factory()
}

/**
 * Stores an array to the extension storage.
 * The new array is replaced with the existing one.
 * @param key entry's key
 * @param array array to store
 * @returns promise
 */
export function setArray<T extends object>(key: string, array: T[]): Promise<void> {
  return setEntry<T[]>(key, array)
}

/**
 * Retreives array from the extension storage
 * @param key entry's key
 * @param factory function that creates default array if it is not found
 * @returns array from the extension storage or an array with default values
 */
export async function getArray<T extends object>(
  key: string,
  factory: () => T[] = () => {
    throw new Error('A factory function must be provided')
  },
): Promise<T[]> {
  const array = await getEntry<T>(key)

  return Array.isArray(array) ? array : factory()
}

/**
 * Abstracts access to the extension storage.
 * Provides default values for non existing entries
 */
export class Storage {
  private listeners: Record<string, Array<(entry: unknown) => void>> = {}

  static readonly networkKey = 'network'
  static readonly networkListKey = 'network-list'
  static readonly swarmKey = 'swarm'
  static readonly sessionKey = 'session'
  static readonly dappsKey = 'dapps'
  static readonly accountsKey = 'accounts'
  static readonly storageVersion = 'storage-version'
  static readonly generalKey = 'general'

  constructor() {
    chrome.storage.onChanged.addListener(this.onChangeListener.bind(this))
  }

  public getStorageVersion(): Promise<string> {
    return getEntry<string>(Storage.storageVersion)
  }

  public setStorageVesion(version: string): Promise<void> {
    return setEntry<string>(Storage.storageVersion, version)
  }

  public getNetworkList(): Promise<Network[]> {
    return getArray<Network>(Storage.networkListKey, networkListFactory)
  }

  public async addNetworkToList(network: Network): Promise<void> {
    const networks = await this.getNetworkList()

    if (!networks.find(({ label }) => network.label === label)) {
      networks.push(network)
      await setArray<Network>(Storage.networkListKey, networks)
    } else {
      throw new Error('Storage: cannot add network, it already exists')
    }
  }

  public async updateNetworkInList(label: string, network: Network): Promise<void> {
    const networks = await this.getNetworkList()
    const index = networks.findIndex((net) => net.label === label)

    if (index >= 0) {
      networks[index] = network
      await setEntry<Network[]>(Storage.networkListKey, networks)
    } else {
      throw new Error("Storage: cannot update network, it doesn't exist")
    }
  }

  public async deleteNetworkFromList(network: Network): Promise<void> {
    const networks = await this.getNetworkList()
    const index = networks.findIndex(({ label }) => network.label === label)

    if (index >= 0) {
      networks.splice(index, 1)
      await setEntry<Network[]>(Storage.networkListKey, networks)
    }
  }

  public getNetwork(): Promise<Network> {
    return getObject<Network>(Storage.networkKey, networkFactory)
  }

  public setNetwork(network: Network): Promise<void> {
    return updateObject<Network>(Storage.networkKey, network)
  }

  public getSwarm(): Promise<Swarm> {
    return getObject<Swarm>(Storage.swarmKey, swarmFactory)
  }

  public setSwarm(swarm: Swarm): Promise<void> {
    return updateObject<Swarm>(Storage.swarmKey, swarm)
  }

  public setSession(session: StorageSession): Promise<void> {
    return updateObject<StorageSession>(Storage.sessionKey, session)
  }

  public getSession(): Promise<StorageSession> {
    return getObject<StorageSession>(Storage.sessionKey, sessionFactory)
  }

  public deleteSession(): Promise<void> {
    return deleteEntry(Storage.sessionKey)
  }

  public async getDapps(name: string, local: boolean): Promise<Dapps> {
    const accountDapps = await getObject<AccountDapps>(Storage.dappsKey, accountDappsFactory)

    return (local ? accountDapps.local : accountDapps.ens)[name] || dappsFactory()
  }

  public getDappsBySession({ ensUserName, localUserName }: MemorySession): Promise<Dapps> {
    return this.getDapps(ensUserName || localUserName, Boolean(localUserName))
  }

  public async getDappBySession(dappId: DappId, session: MemorySession): Promise<Dapp | undefined> {
    const dapps = await this.getDappsBySession(session)

    return dapps[dappId] || dappFactory(dappId)
  }

  public async updateDappBySession(
    dappId: DappId,
    dapp: Partial<Dapp>,
    { ensUserName, localUserName }: MemorySession,
  ): Promise<void> {
    const name = ensUserName || localUserName

    const accountDapps = await getObject<AccountDapps>(Storage.dappsKey, accountDappsFactory)

    const accountDappsRecord = Boolean(localUserName) ? accountDapps.local : accountDapps.ens

    const dapps = accountDappsRecord[name] || dappsFactory()

    const updatedDapp = {
      ...dappFactory(dappId),
      ...(dapps[dappId] || {}),
      ...dapp,
      dappId,
    }

    if (!updatedDapp.fullStorageAccess && Object.keys(updatedDapp.podPermissions).length === 0) {
      delete dapps[dappId]
    } else {
      dapps[dappId] = updatedDapp
    }

    accountDappsRecord[name] = dapps

    return updateObject<AccountDapps>(Storage.dappsKey, accountDapps)
  }

  public deleteDapps(): Promise<void> {
    return deleteEntry(Storage.dappsKey)
  }

  public async setDappPodPermissionBySession(
    dappId: DappId,
    podPermission: PodPermission,
    session: MemorySession,
  ): Promise<void> {
    const dapp = await this.getDappBySession(dappId, session)

    const permission = dapp.podPermissions[podPermission.podName]

    if (permission) {
      permission.allowedActions = podPermission.allowedActions
    } else {
      dapp.podPermissions[podPermission.podName] = podPermission
    }

    return this.updateDappBySession(dappId, dapp, session)
  }

  public async getAccount(name: string): Promise<StorageAccount> {
    const accounts = await getObject<Accounts>(Storage.accountsKey, accountsFactory)

    return accounts[name.toLowerCase()]
  }

  public async getAllAccounts(): Promise<StorageAccount[]> {
    const accounts = await getObject<Accounts>(Storage.accountsKey, accountsFactory)

    return Object.keys(accounts).map((name) => accounts[name])
  }

  public async setAccount(account: StorageAccount): Promise<void> {
    const accounts = await getObject<Accounts>(Storage.accountsKey, accountsFactory)

    accounts[account.name.toLowerCase()] = account

    return updateObject<Accounts>(Storage.accountsKey, accounts)
  }

  public async updateAccount(name: string, update: Partial<StorageAccount>): Promise<void> {
    const accounts = await getObject<Accounts>(Storage.accountsKey, accountsFactory)

    accounts[name.toLowerCase()] = {
      ...accounts[name],
      ...update,
    }

    return updateObject<Accounts>(Storage.accountsKey, accounts)
  }

  public deleteAccounts(): Promise<void> {
    return deleteEntry(Storage.accountsKey)
  }

  public updateGeneral(data: Partial<General>): Promise<void> {
    return updateObject(Storage.generalKey, data)
  }

  public getGeneral(): Promise<General> {
    return getObject(Storage.generalKey, generalFactory)
  }

  public onNetworkChange(listener: (network: Network) => void) {
    this.setListener(Storage.networkKey, listener)
  }

  public onSwarmChange(listener: (swarm: Swarm) => void) {
    this.setListener(Storage.swarmKey, listener)
  }

  public onSessionChange(listener: (session: StorageSession) => void) {
    this.setListener(Storage.sessionKey, listener)
  }

  public removeListener(listener: (entry: unknown) => void) {
    Object.values(this.listeners).forEach((listeners) => {
      removeAllValues(listeners, listener)
    })
  }

  private onChangeListener(changes: { [key: string]: chrome.storage.StorageChange }) {
    for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
      ;(this.listeners[key] || []).forEach((listener) => listener(newValue || oldValue))
    }
  }

  private setListener(key: string, listener: (entry: unknown) => void) {
    if (!this.listeners[key]) {
      this.listeners[key] = []
    }
    this.listeners[key].push(listener)
  }
}
