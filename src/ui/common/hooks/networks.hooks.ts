import { useEffect, useState } from 'react'
import { getNetworkList, getSelectedNetwork } from '../../../messaging/content-api.messaging'
import { Network } from '../../../model/storage/network.model'

export interface NetworkHooksData {
  selectedNetwork: Network
  networks: Network[]
}

export function useNetworks(): NetworkHooksData {
  const [networks, setNetworks] = useState<Network[]>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(null)

  const fetchNetworks = async () => {
    const networkList = await getNetworkList()
    setNetworks(networkList)
  }

  const fetchSelectedNetwork = async () => {
    const network = await getSelectedNetwork()
    setSelectedNetwork(network)
  }

  useEffect(() => {
    fetchNetworks()
    fetchSelectedNetwork()
  }, [])

  if (selectedNetwork && networks) {
    return { selectedNetwork, networks }
  }

  return { selectedNetwork: null, networks: null }
}
