import { isNetwork } from '../../messaging/message.asserts'
import { AccountDapps } from '../../model/storage/dapps.model'
import { Network } from '../../model/storage/network.model'
import { Version } from '../../model/storage/version.model'
import { versionFromString } from '../../utils/converters'
import { accountDappsFactory, networkListFactory } from './storage-factories'
import { getArray, getObject, setArray, Storage, updateObject } from './storage.service'

export function migrateDapps(accountDapps: AccountDapps, { major, minor }: Version): AccountDapps {
  if (major <= 1 && minor <= 1) {
    return accountDappsFactory()
  }

  return null
}

export function migrateNetworks(networks: Network[]): Network[] {
  const defaultNetworks = networkListFactory()

  if (!networks || !Array.isArray(networks)) {
    return defaultNetworks
  }

  return defaultNetworks.concat(networks.filter((network) => network.custom && isNetwork(network)))
}

/**
 * Migrates existing data to match the current version
 * @returns promise
 */
export async function migrate(newVersionString: string): Promise<void> {
  const storage = new Storage()
  const currentVersionString = await storage.getStorageVersion()
  let currentVersion: Version

  try {
    currentVersion = versionFromString(currentVersionString)
  } catch (error) {
    currentVersion = {
      major: 0,
      minor: 0,
      patch: 0,
    }
  }

  const accountDapps = await getObject<AccountDapps>(Storage.dappsKey, accountDappsFactory)
  const updatedAccountDapps = migrateDapps(accountDapps, currentVersion)

  const networks = await getArray<Network>(Storage.networkListKey, networkListFactory)
  const updatedNetworks = migrateNetworks(networks)

  if (updatedAccountDapps) {
    await updateObject<AccountDapps>(Storage.dappsKey, updatedAccountDapps)
  }

  if (updatedNetworks) {
    await setArray<Network>(Storage.networkListKey, updatedNetworks)
  }

  await storage.setStorageVesion(newVersionString)
}
