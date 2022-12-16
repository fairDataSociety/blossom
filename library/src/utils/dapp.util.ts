const dappIdRegex = new RegExp('.+/bzz/([^/]+).*')

export function getDappId(): string | null {
  const url = window.location.href

  // extracts dApp ENS name from a bzz link (e.g http://localhost:1633/bzz/ENS/...)
  const result = dappIdRegex.exec(url)

  if (!result || !result[1]) {
    return null
  }

  return result[1]
}
