import type { AccountData, Directory } from '@fairdatasociety/fdp-storage'
import { ApiActions } from '../constants/api-actions.enum'
import { BlossomMessages } from '../messages/blossom-messages'
import { FdpStorageRequest } from '../model/fdp-storage-request.model'
import { FdpStorage, PersonalStorage } from '../model/fdp-storage.model'

function createProxy<T extends object>(path: string, messages: BlossomMessages): T {
  return new Proxy<T>(
    {} as T,
    {
      get(target: unknown, property: string) {
        return (...parameters: unknown[]) => {
          return messages.sendMessage(ApiActions.FDP_STORAGE, {
            accessor: `${path}.${property}`,
            parameters,
          } as FdpStorageRequest)
        }
      },
    } as unknown as T,
  )
}

function createFdpStorageProxy(messages: BlossomMessages): FdpStorage {
  return {
    account: createProxy<AccountData>('account', messages),
    // TODO some of the types are not exported by fdp-storage, should be exported
    connection: createProxy<Record<string, unknown>>('connection', messages),
    directory: createProxy<Directory>('directory', messages),
    ens: createProxy<Record<string, unknown>>('ens', messages),
    file: createProxy<Record<string, unknown>>('file', messages),
    personalStorage: createProxy<PersonalStorage>('personalStorage', messages),
  } as unknown as FdpStorage
}

export default createFdpStorageProxy
