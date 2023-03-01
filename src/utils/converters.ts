import { isString } from '../messaging/message.asserts'
import { BytesMessage } from '../messaging/scripts.messaging'
import { Version } from '../model/storage/version.model'

export function versionFromString(version: string): Version {
  if (!isString(version)) {
    throw new Error('Invalid version string')
  }

  const parts = version.split('.')

  if (parts.length !== 3) {
    throw new Error('Invalid version string')
  }

  const [major, minor, patch] = parts.map((versionNumber) => parseInt(versionNumber))

  if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
    throw new Error('Invalid version string')
  }

  return {
    major,
    minor,
    patch,
  }
}

export function versionToString(version: Version): string {
  const { major, minor, patch } = version || {}

  if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
    throw new Error('Invalid version object')
  }

  return `${major}.${minor}.${patch}`
}

export function uint8ArrayToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes)
}

export function stringToUint8Array(serializedBytes: string): Uint8Array {
  return new TextEncoder().encode(serializedBytes)
}

export function uint8ArrayToSerializedParameter(bytes: Uint8Array): BytesMessage {
  return {
    type: 'bytes',
    value: uint8ArrayToString(bytes),
  }
}
