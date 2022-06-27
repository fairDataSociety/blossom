import { Network } from '../../model/storage/network.model'
import { removeAllValues } from '../../utils/array'
import { networkFactory } from './storage-factories'
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
export async function setObject<T extends object>(key: string, object: T): Promise<void> {
  const existingObject = await getObject<T>(key, () => ({} as T))

  return setEntry<T>(key, { ...existingObject, ...object })
}

/**
 * Retreives object from the extension storage
 * @param key entry's key
 * @param factory function that creates default object if it is not found
 * @returns object from the extension storage or an object with default values
 */
export async function getObject<T extends object>(key: string, factory: () => T): Promise<T> {
  const object = await getEntry<T>(key)

  return typeof object === 'object' ? object : factory()
}

/**
 * Abstracts access to the extension storage.
 * Provides default values for non existing entries
 */
export class Storage {
  private listeners: Record<string, Array<(entry: unknown) => void>> = {}

  static readonly networkKey = 'network'

  constructor() {
    chrome.storage.onChanged.addListener(this.onChangeListener.bind(this))
  }

  public getNetwork(): Promise<Network> {
    return getObject<Network>(Storage.networkKey, networkFactory)
  }

  public setNetwork(network: Network): Promise<void> {
    return setObject<Network>(Storage.networkKey, network)
  }

  public onNetworkChange(listener: (network: Network) => void) {
    this.setListener(Storage.networkKey, listener)
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
