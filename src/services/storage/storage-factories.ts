import { networks } from '../../constants/networks'
import { Network } from '../../model/storage/network.model'

export function networkFactory(): Network {
  return Object.assign({}, networks[0])
}

export function networkListFactory(): Network[] {
  return Object.assign([], networks)
}
