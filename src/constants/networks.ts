import { FdpContracts } from '@fairdatasociety/fdp-storage'
import { Network } from '../model/storage/network.model'
import { extractNetworkConfig } from '../utils/network'

const { Environments } = FdpContracts

export const networks: Network[] = [
  {
    ...extractNetworkConfig(Environments.LOCALHOST),
    label: 'FDP Play',
    rpc: process.env.CI_TESTS === 'true' ? 'http://172.18.0.1:9545' : 'http://localhost:9545',
    custom: false,
  },
  {
    ...extractNetworkConfig(Environments.GOERLI),
    label: 'Görli',
    rpc: 'https://xdai.dev.fairdatasociety.org',
    custom: false,
  },
]
