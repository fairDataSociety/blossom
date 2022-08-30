import { EthAddress } from '@ethersphere/bee-js/dist/types/utils/eth'

export interface Network {
  label: string
  rpc: string
  ensRegistry?: EthAddress
  fdsRegistrar?: EthAddress
  publicResolver?: EthAddress
  custom: boolean
}
