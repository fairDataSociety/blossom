import { isString } from '../messaging/message.asserts'
import { BytesMessage } from '../messaging/scripts.messaging'
import { Version } from '../model/storage/version.model'

const BASE64_MIME_TYPE = 'data:application/octet-stream;base64,'

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

function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export function uint8ArrayToBase64(bytes: Uint8Array): Promise<string> {
  return convertBlobToBase64(new Blob([bytes]))
}

export function base64ToUint8Array(base64String: string): Uint8Array {
  return Uint8Array.from(
    atob(
      base64String.startsWith(BASE64_MIME_TYPE)
        ? base64String.substring(BASE64_MIME_TYPE.length)
        : base64String,
    ),
    (c) => c.charCodeAt(0),
  )
}

export async function uint8ArrayToSerializedParameter(bytes: Uint8Array): Promise<BytesMessage> {
  return {
    type: 'bytes',
    value: await uint8ArrayToBase64(bytes),
  }
}
