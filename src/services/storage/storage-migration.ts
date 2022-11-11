import { AccountDapps } from '../../model/storage/dapps.model'
import { accountDappsFactory } from './storage-factories'

export function migrateDapps(): AccountDapps {
  return accountDappsFactory()
}
