import { assertBeeUrl } from '../../messaging/message.asserts'
import { DappId } from '../../model/general.types'

// matches CID URLs like https://1234567890.swarm.localhost:1633
const subdomainRegex = new RegExp('^(https?://)?(.+).swarm.localhost(:|/|$)')

export function dappUrlToId(url: string, beeUrl: string): DappId {
  assertBeeUrl(beeUrl)

  const bzzUrl = beeUrl + (beeUrl.endsWith('/') ? '' : '/') + 'bzz/'

  // extracts dApp ENS name from a bzz link (e.g http://127.0.0.1:1633/bzz/ENS/...)
  let result = new RegExp(`${bzzUrl}([^/]+).*`).exec(url)

  if (result && result[1]) {
    return result[1]
  }

  result = subdomainRegex.exec(url)

  if (result && result[2]) {
    return result[2]
  }

  throw new Error('Invalid dApp URL')
}

export function dappIdToPodName(dappId: DappId): string {
  // The logic for pod names might be changed in the future
  return dappId
}
