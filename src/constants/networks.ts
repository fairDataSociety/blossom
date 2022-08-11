import { Network } from '../model/storage/network.model'

export const networks: Network[] = [
  {
    label: 'Localhost',
    rpc: process.env.CI === 'true' ? 'http://172.18.0.1:9545' : 'http://localhost:9545',
    custom: false,
  },
]
