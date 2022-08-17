import { Network } from '../../model/storage/network.model'
import { Swarm } from '../../model/storage/swarm.model'
import { Session } from '../../model/storage/session.model'
import { removeAllValues } from '../../utils/array'
import { sessionFactory, networkFactory, networkListFactory, swarmFactory } from './storage-factories'
import migrate from './storage-migration'

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

  constructor() {
    chrome.storage.onChanged.addListener(this.onChangeListener.bind(this))
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

  public setSession(session: Session): Promise<void> {
    return updateObject<Session>(Storage.sessionKey, session)
  }

  public getSession(): Promise<Session> {
    return getObject<Session>(Storage.sessionKey, sessionFactory)
  }

  public deleteSession(): Promise<void> {
    return deleteEntry(Storage.sessionKey)
  }

  public onNetworkChange(listener: (network: Network) => void) {
    this.setListener(Storage.networkKey, listener)
  }

  public onSwarmChange(listener: (swarm: Swarm) => void) {
    this.setListener(Storage.swarmKey, listener)
  }

  public onSessionChange(listener: (session: Session) => void) {
    this.setListener(Storage.sessionKey, listener)
  }

  public removeListener(listener: (entry: unknown) => void) {
    Object.values(this.listeners).forEach((listeners) => {
      removeAllValues(listeners, listener)
    })
  }

  /**
   * Migrates existing data to match the current version
   * @returns promise
   */
  public migrate(): Promise<void> {
    return migrate()
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
