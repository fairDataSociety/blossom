import { DEFAULT_BEE_URL } from '../../constants/constants'
import { isNetwork } from '../../messaging/message.asserts'
import { AccountDapps } from '../../model/storage/dapps.model'
import { Network } from '../../model/storage/network.model'
import { Swarm } from '../../model/storage/swarm.model'
import { Version } from '../../model/storage/version.model'
import { versionFromString } from '../../utils/converters'
import { accountDappsFactory, networkListFactory, swarmFactory } from './storage-factories'
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

export function migrateSwarm(swarm: Swarm): Swarm {
  if (!swarm.swarmUrl) {
    swarm.swarmUrl = DEFAULT_BEE_URL
  }

  if (typeof swarm.extensionEnabled !== 'boolean') {
    swarm.extensionEnabled = false
  }

  return swarm
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

  const swarm = await getObject<Swarm>(Storage.swarmKey, swarmFactory)
  const updatedSwarm = migrateSwarm(swarm)

  if (updatedAccountDapps) {
    await updateObject<AccountDapps>(Storage.dappsKey, updatedAccountDapps)
  }

  if (updatedNetworks) {
    await setArray<Network>(Storage.networkListKey, updatedNetworks)
  }

  if (updatedSwarm) {
    await updateObject<Swarm>(Storage.swarmKey, updatedSwarm)
  }

  await storage.setStorageVesion(newVersionString)
}
