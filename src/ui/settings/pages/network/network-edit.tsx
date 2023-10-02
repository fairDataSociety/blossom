import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import { Router } from '@mui/icons-material'
import RouteCodes from '../../routes/route-codes'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import Header from '../../../common/components/header/header.component'
import NetworkForm from './network-form'
import { Network } from '../../../../model/storage/network.model'
import { deleteNetwork, editNetwork, getNetworkList } from '../../../../messaging/content-api.messaging'
import { useNavigate, useParams } from 'react-router-dom'

const NetworkEdit = () => {
  const navigate = useNavigate()
  const { label } = useParams()

  const [network, setNetwork] = useState<Network>(null)

  const fetchNetwork = async () => {
    const networkList = await getNetworkList()
    const network = networkList.find((net) => net.label === label)

    if (!network) {
      return navigate(RouteCodes.network)
    }

    setNetwork(network)
  }

  useEffect(() => {
    fetchNetwork()
  }, [])

  const onUpdateNetwork = async (updatedNetwork: Network): Promise<void> => {
    await editNetwork(network.label, updatedNetwork)

    navigate(RouteCodes.network)
  }

  const onDeleteNetwork = async (): Promise<void> => {
    await deleteNetwork(network)

    navigate(RouteCodes.network)
  }

  if (!network) {
    return null
  }

  return (
    <FlexColumnDiv>
      <Header title={intl.get('NETWORK')} image={Router} backRoute={RouteCodes.network} />
      <NetworkForm
        network={network}
        disabled={!network.custom}
        onChange={onUpdateNetwork}
        canDelete
        onDelete={onDeleteNetwork}
      />
    </FlexColumnDiv>
  )
}

export default NetworkEdit
