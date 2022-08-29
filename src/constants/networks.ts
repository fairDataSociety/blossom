import { Network } from '../model/storage/network.model'

export const networks: Network[] = [
  {
    label: 'Localhost',
    rpc: 'http://localhost:9545',
    custom: false,
  },
  {
    label: 'Görli',
    rpc: 'https://xdai.dev.fairdatasociety.org',
    custom: false,
  },
]
