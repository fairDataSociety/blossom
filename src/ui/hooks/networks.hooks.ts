import { useEffect, useState } from 'react'
import { getNetworkList } from '../../messaging/content-api.messaging'
import { Network } from '../../model/storage/network.model'

export function useNetworks(): Network[] {
  const [networks, setNetworks] = useState<Network[]>(null)

  const fetchNetworks = async () => {
    const networkList = await getNetworkList()
    setNetworks(networkList)
  }

  useEffect(() => {
    fetchNetworks()
  }, [])

  return networks
}
