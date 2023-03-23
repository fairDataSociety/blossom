import { whitelistedDapps } from '../../constants/whitelisted-dapps'
import { assertBeeUrl } from '../../messaging/message.asserts'
import { DappId } from '../../model/general.types'

function constructSubdomainRegex(beeUrl: string): RegExp {
  const [protocol, domain] = beeUrl.split('://')

  // extracts dApp ENS name from a swarm subdomain link (e.g http://ENS.swarm.localhost:1633...)
  return new RegExp(
    `${protocol}://(.+).swarm.${domain.endsWith('/') ? domain.substring(0, domain.length - 1) : domain}.*`,
  )
}

function constructBzzRegex(beeUrl: string): RegExp {
  const bzzUrl = beeUrl + (beeUrl.endsWith('/') ? '' : '/') + 'bzz/'

  // extracts dApp ENS name from a bzz link (e.g http://localhost:1633/bzz/ENS/...)
  return new RegExp(`${bzzUrl}([^/]+).*`)
}

function extractDappIdFromRegex(url: string, regex: RegExp): string | null {
  const result = regex.exec(url)

  if (result && result[1]) {
    return result[1]
  }

  return null
}

function extractDappIdFromWhitelistedDapps(url: string): string | undefined {
  const { dappId } = whitelistedDapps.find(({ url: dappUrl }) => url.startsWith(dappUrl)) || {}

  return dappId
}

function isDappIdForged(dappId: string, url: string): boolean {
  let isWhitelistedDappId = false

  const matchingUrl = whitelistedDapps.some(({ url: currentUrl, dappId: currentDappId }) => {
    if (currentDappId === dappId) {
      isWhitelistedDappId = true

      return url.startsWith(currentUrl)
    }

    return false
  })

  return isWhitelistedDappId && !matchingUrl
}

export function dappUrlToId(url: string, beeUrl: string): DappId {
  assertBeeUrl(beeUrl)

  const dappId =
    extractDappIdFromWhitelistedDapps(url) ||
    extractDappIdFromRegex(url, constructBzzRegex(beeUrl)) ||
    extractDappIdFromRegex(url, constructSubdomainRegex(beeUrl))

  if (dappId && !isDappIdForged(dappId, url)) {
    return dappId
  }

  throw new Error('Invalid dApp URL')
}

export function dappIdToPodName(dappId: DappId): string {
  // The logic for pod names might be changed in the future
  return dappId
}
