import { Directory, FdpStorage, PersonalStorage } from '@fairdatasociety/fdp-storage'
import { File } from '@fairdatasociety/fdp-storage/dist/file/file'
import { IS_DAPP_POD_CREATED } from '../../constants/fdp-storage-methods'
import { isSerializedUint8Array, isString } from '../../messaging/message.asserts'
import { DappId } from '../../model/general.types'
import { Dapp } from '../../model/storage/dapps.model'
import { isPromise, isUint8Array } from '../../utils/asserts'
import { stringToUint8Array, uint8ArrayToSerializedParameter } from '../../utils/converters'
import { dappIdToPodName } from './fdp-storage.utils'

type FdpStorageHandler = (
  fdpObject: unknown,
  method: string,
  parameters: unknown[],
  dappId: DappId,
  dapp: Dapp,
) => Promise<unknown>

type FdpStorageProxy = {
  handler: FdpStorageHandler
  podAllowedMethods: string[]
  fullAccessMethods: string[]
}

function deserializeParameters(parameters: unknown[]): unknown[] {
  return parameters.map((parameter) => {
    if (isSerializedUint8Array(parameter)) {
      return stringToUint8Array(parameter.value)
    }

    return parameter
  })
}

async function serializeResponse(response: unknown): Promise<unknown> {
  if (isUint8Array(response)) {
    return await uint8ArrayToSerializedParameter(response)
  }

  return response
}

function personalStorageHandler(
  personalStorage: PersonalStorage,
  method: string,
  parameters: unknown[],
  dappId: DappId,
) {
  if (method === IS_DAPP_POD_CREATED) {
    parameters = [dappIdToPodName(dappId)]
  }

  return personalStorage[method](...parameters)
}

function directoryHandler(directory: Directory, method: string, parameters: unknown[]) {
  return directory[method](...parameters)
}

function fileHandler(file: File, method: string, parameters: unknown[]) {
  return file[method](...deserializeParameters(parameters))
}

const proxy: Record<string, FdpStorageProxy> = {
  personalStorage: {
    handler: personalStorageHandler,
    podAllowedMethods: ['create', IS_DAPP_POD_CREATED],
    fullAccessMethods: ['delete', 'getSharedInfo', 'list', 'saveShared', 'share'],
  },
  directory: {
    handler: directoryHandler,
    podAllowedMethods: ['read', 'create', 'delete'],
    fullAccessMethods: [],
  },
  file: {
    handler: fileHandler,
    podAllowedMethods: [
      'downloadData',
      'uploadData',
      'delete',
      'share',
      'defaultUploadOptions',
      'getSharedInfo',
      'saveShared',
    ],
    fullAccessMethods: [],
  },
}

export function isPodBasedMethod(property: string, method: string): boolean {
  const propertyProxy = proxy[property]

  return Boolean(propertyProxy && propertyProxy.podAllowedMethods.includes(method))
}

export function getPodNameFromParams(dappId: DappId, method: string, parameters: unknown[]): string {
  if (method === IS_DAPP_POD_CREATED) {
    return dappIdToPodName(dappId)
  }

  if (!isString(parameters[0])) {
    throw new Error('Blossom: Invalid pod name')
  }

  return parameters[0]
}

export function callFdpStorageMethod(
  fdpStorage: FdpStorage,
  property: string,
  method: string,
  parameters: unknown[],
  dappId: DappId,
  dapp: Dapp | null,
) {
  const propertyProxy = proxy[property]

  if (!propertyProxy) {
    throw new Error('Blossom: property is not accessible')
  }

  const { handler, podAllowedMethods, fullAccessMethods } = propertyProxy

  let methodAllowed = false

  if (dapp?.fullStorageAccess) {
    methodAllowed = podAllowedMethods.includes(method) || fullAccessMethods.includes(method)
  } else {
    methodAllowed = podAllowedMethods.includes(method)
  }

  if (!methodAllowed) {
    throw new Error('Blossom: method not allowed')
  }

  console.log(`Invoking fdpStorage.${property}.${method} by dapp with ID ${dappId}`)

  const response = handler(fdpStorage[property], method, deserializeParameters(parameters), dappId, dapp)

  if (!isPromise(response)) {
    return serializeResponse(response)
  }

  return new Promise(async (resolve, reject) => {
    try {
      const result = await response

      resolve(await serializeResponse(result))
    } catch (error) {
      reject(error)
    }
  })
}
