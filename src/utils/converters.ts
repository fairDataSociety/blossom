import { isString } from '../messaging/message.asserts'
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

  if (major === NaN || minor === NaN || patch === NaN) {
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

  if (major === NaN || minor === NaN || patch === NaN) {
    throw new Error('Invalid version object')
  }

  return `${major}.${minor}.${patch}`
}
