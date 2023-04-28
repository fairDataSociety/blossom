import type { AccountData, Directory } from '@fairdatasociety/fdp-storage'
import { ApiActions } from '../constants/api-actions.enum'
import { BlossomMessages } from '../messages/blossom-messages'
import { FdpStorageRequest } from '../model/fdp-storage-request.model'
import { FdpStorage, PersonalStorage } from '../model/fdp-storage.model'
import {
  isSerializedUint8Array,
  uint8ArrayToSerializedParameter,
  base64ToUint8Array,
  isUint8Array,
} from '../utils/serialization'

function serializeParameters(parameters: unknown[]): Promise<unknown[]> {
  return Promise.all(
    parameters.map(async parameter => {
      if (isUint8Array(parameter)) {
        return await uint8ArrayToSerializedParameter(parameter)
      }

      return parameter
    }),
  )
}

function deserializeResponse(response: unknown): unknown {
  if (isSerializedUint8Array(response)) {
    return base64ToUint8Array(response.value)
  }

  return response
}

function createProxy<T extends object>(path: string, messages: BlossomMessages): T {
  return new Proxy<T>(
    {} as T,
    {
      get(target: unknown, property: string) {
        return async (...parameters: unknown[]) => {
          const response = await messages.sendMessage(ApiActions.FDP_STORAGE, {
            accessor: `${path}.${property}`,
            parameters: await serializeParameters(parameters),
          } as FdpStorageRequest)

          return deserializeResponse(response)
        }
      },
    } as unknown as T,
  )
}

function createObjectProxy<T extends object>(path: string): T {
  return new Proxy<T>({} as T, {
    get() {
      return {}
    },
    set() {
      return true
    },
  })
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
    cache: createObjectProxy<{ object: any }>('cache'),
  } as unknown as FdpStorage
}

export default createFdpStorageProxy
