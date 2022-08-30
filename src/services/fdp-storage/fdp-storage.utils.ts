import { assertBeeUrl } from '../../messaging/message.asserts'
import { DappId } from '../../model/general.types'

export function dappUrlToId(url: string, beeUrl: string): DappId {
  assertBeeUrl(beeUrl)

  const bzzUrl = beeUrl + (beeUrl.endsWith('/') ? '' : '/') + 'bzz/'

  // extracts dApp ENS name from a bzz link (e.g http://127.0.0.1:1633/bzz/ENS/...)
  const result = new RegExp(`${bzzUrl}([^/]+).*`).exec(url)

  if (!result || !result[1]) {
    throw new Error('Invalid dApp URL')
  }

  return result[1]
}

export function dappIdToPodName(dappId: DappId): string {
  // The logic for pod names might be changed in the future
  return dappId
}
