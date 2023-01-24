import { AccountDapps } from '../../model/storage/dapps.model'
import { Version } from '../../model/storage/version.model'
import { versionFromString } from '../../utils/converters'
import { accountDappsFactory } from './storage-factories'
import { getObject, Storage, updateObject } from './storage.service'

export function migrateDapps(accountDapps: AccountDapps, { major, minor }: Version): AccountDapps {
  if (major <= 1 && minor <= 1) {
    return accountDappsFactory()
  }

  return null
}

/**
 * Migrates existing data to match the current version
 * @returns promise
 */
export async function migrate(newVersionString: string): Promise<void> {
  const currentVersionString = await this.getStorageVersion()
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

  if (updatedAccountDapps) {
    await updateObject<AccountDapps>(Storage.dappsKey, updatedAccountDapps)
  }

  await this.setStorageVesion(newVersionString)
}
