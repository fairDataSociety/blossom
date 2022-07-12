import { EthAddress } from '@ethersphere/bee-js/dist/types/utils/eth'

export interface Network {
  label: string
  rpc: string
  ensRegistry?: EthAddress
  subdomainRegistrar?: EthAddress
  publicResolver?: EthAddress
  custom: boolean
}
