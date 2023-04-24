const dappIdRegex = new RegExp('.+/bzz/([^/]+).*')
const subdomainDappIdRegex = new RegExp('https?://(.+).swarm.localhost:.*')

export function getDappId(): string | null {
  const url = window.location.href

  // extracts dApp ENS name from a bzz link (e.g http://localhost:1633/bzz/ENS/...)
  let result = dappIdRegex.exec(url)

  if (!result || !result[1]) {
    result = subdomainDappIdRegex.exec(url)
  }

  if (!result || !result[1]) {
    return null
  }

  return result[1]
}
