import { Address } from '../general.types'

export interface Network {
  label: string
  rpc: string
  ensRegistry?: Address
  fdsRegistrar?: Address
  publicResolver?: Address
  custom: boolean
}
