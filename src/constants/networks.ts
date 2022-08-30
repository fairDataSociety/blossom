import { EthAddress } from '@ethersphere/bee-js/dist/types/utils/eth'
import { Network } from '../model/storage/network.model'

// TODO when the https://github.com/fairDataSociety/fdp-storage/issues/131 issue gets fixed,
// the addresses should be replaced with values from FdpContracts
export const networks: Network[] = [
  {
    label: 'FDP Play',
    rpc: process.env.CI_TESTS === 'true' ? 'http://172.18.0.1:9545' : 'http://localhost:9545',
    custom: false,
    ensRegistry: '0x26b4AFb60d6C903165150C6F0AA14F8016bE4aec' as unknown as EthAddress,
    fdsRegistrar: '0x630589690929E9cdEFDeF0734717a9eF3Ec7Fcfe' as unknown as EthAddress,
    publicResolver: '0xA94B7f0465E98609391C623d0560C5720a3f2D33' as unknown as EthAddress,
  },
  {
    label: 'Görli',
    rpc: 'https://xdai.dev.fairdatasociety.org',
    custom: false,
    ensRegistry: '0x42B22483e3c8dF794f351939620572d1a3193c12' as unknown as EthAddress,
    fdsRegistrar: '0xF4C9Cd25031E3BB8c5618299bf35b349c1aAb6A9' as unknown as EthAddress,
    publicResolver: '0xbfeCC6c32B224F7D0026ac86506Fe40A9607BD14' as unknown as EthAddress,
  },
]
