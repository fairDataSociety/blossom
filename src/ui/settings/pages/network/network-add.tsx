import React from 'react'
import intl from 'react-intl-universal'
import { Router } from '@mui/icons-material'
import RouteCodes from '../../routes/route-codes'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import Header from '../../../common/components/header/header.component'
import NetworkForm from './network-form'
import { Network } from '../../../../model/storage/network.model'
import { addNetwork } from '../../../../messaging/content-api.messaging'
import { useNavigate } from 'react-router-dom'

const emptyNetwork: Network = {
  custom: true,
  label: '',
  rpc: '',
}

const NetworkAdd = () => {
  const navigate = useNavigate()

  const onCreateNetwork = async (network: Network): Promise<void> => {
    await addNetwork(network)

    navigate(RouteCodes.network)
  }

  return (
    <FlexColumnDiv>
      <Header title={intl.get('NETWORK')} image={Router} backRoute={RouteCodes.network} />
      <NetworkForm network={emptyNetwork} disabled={false} onChange={onCreateNetwork} canDelete={false} />
    </FlexColumnDiv>
  )
}

export default NetworkAdd
