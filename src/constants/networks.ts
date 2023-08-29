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
    ...extractNetworkConfig(Environments.SEPOLIA),
    label: 'Sepolia',
    custom: false,
    blockExplorerUrl: 'https://sepolia.etherscan.io/tx/',
  },
  {
    ...extractNetworkConfig(Environments.GOERLI),
    label: 'Görli',
    custom: false,
    blockExplorerUrl: 'https://goerli.etherscan.io/tx/',
  },
  {
    ...extractNetworkConfig(Environments.OPTIMISM_GOERLI),
    label: 'Optimism Goerli',
    custom: false,
    blockExplorerUrl: 'https://goerli-optimism.etherscan.io/tx/',
  },
  {
    ...extractNetworkConfig(Environments.ARBITRUM_GOERLI),
    label: 'Arbitrum Goerli',
    custom: false,
    blockExplorerUrl: 'https://goerli.arbiscan.io/tx/',
  },
]
