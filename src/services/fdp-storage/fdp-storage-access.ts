import { Directory, FdpStorage, PersonalStorage } from '@fairdatasociety/fdp-storage'
import { File } from '@fairdatasociety/fdp-storage/dist/file/file'
import { DappId } from '../../model/general.types'
import { Dapp } from '../../model/storage/dapps.model'
import { dappIdToPodName } from './fdp-storage.utils'

type FdpStorageHandler = (
  fdpObject: unknown,
  method: string,
  parameters: unknown[],
  dappId: DappId,
  dapp: Dapp,
) => Promise<unknown>

type FdpStorageProxy = { handler: FdpStorageHandler; allowedMethods: string[]; requiresPod: boolean }

function personalStorageHandler(
  personalStorage: PersonalStorage,
  method: string,
  parameters: unknown[],
  dappId: DappId,
) {
  parameters.shift()

  return personalStorage[method](dappIdToPodName(dappId), ...parameters)
}

function directoryHandler(directory: Directory, method: string, parameters: unknown[]) {
  return directory[method](...parameters)
}

function fileHandler(file: File, method: string, parameters: unknown[]) {
  return file[method](...parameters)
}

const proxy: Record<string, FdpStorageProxy> = {
  personalStorage: {
    handler: personalStorageHandler,
    allowedMethods: ['create'],
    requiresPod: false,
  },
  directory: {
    handler: directoryHandler,
    allowedMethods: ['read', 'create', 'delete'],
    requiresPod: true,
  },
  file: {
    handler: fileHandler,
    allowedMethods: ['downloadData', 'uploadData', 'delete', 'share'],
    requiresPod: true,
  },
}

export function callFdpStorageMethod(
  fdpStorage: FdpStorage,
  property: string,
  method: string,
  parameters: unknown[],
  dappId: DappId,
  dapp: Dapp,
) {
  const propertyProxy = proxy[property]

  if (!propertyProxy) {
    throw new Error('Blossom: property is not accessible')
  }

  const { handler, allowedMethods, requiresPod } = propertyProxy

  if (!allowedMethods.includes(method)) {
    throw new Error('Blossom: method not allowed')
  }

  if (requiresPod && (parameters[0] as string) !== dappIdToPodName(dappId)) {
    throw new Error('Blossom: pod is not accessible')
  }

  console.log(`Invoking fdpStorage.${property}.${method} by dapp with ID ${dappId}`)

  return handler(fdpStorage[property], method, parameters, dappId, dapp)
}
