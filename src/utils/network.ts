import { FdpContracts } from '@fairdatasociety/fdp-storage'
import { Address } from '../model/general.types'

const { getEnvironmentConfig } = FdpContracts

export function extractNetworkConfig(environment: FdpContracts.Environments): {
  ensRegistry: Address
  fdsRegistrar: Address
  publicResolver: Address
  rpc: string
} {
  const {
    contractAddresses: { ensRegistry, fdsRegistrar, publicResolver },
    rpcUrl,
  } = getEnvironmentConfig(environment)

  return {
    ensRegistry: ensRegistry as unknown as Address,
    fdsRegistrar: fdsRegistrar as unknown as Address,
    publicResolver: publicResolver as unknown as Address,
    rpc: rpcUrl,
  }
}
