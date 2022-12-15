import { AccountDapps } from '../../model/storage/dapps.model'
import { Version } from '../../model/storage/version.model'
import { accountDappsFactory } from './storage-factories'

export function migrateDapps(accountDapps: AccountDapps, { major, minor }: Version): AccountDapps {
  if (major <= 1 && minor <= 1) {
    return accountDappsFactory()
  }

  return null
}
