import { DappId } from '../../model/general.types'

export function dappUrlToId(url: string, beeUrl: string): DappId {
  let bzzUrl = beeUrl + (beeUrl.endsWith('/') ? '' : '/') + 'bzz/'

  if (!bzzUrl.startsWith('http')) {
    bzzUrl = `http://${bzzUrl}`
  }

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
