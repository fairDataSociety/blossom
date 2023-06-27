import React from 'react'
import intl from 'react-intl-universal'
import { Router } from '@mui/icons-material'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import Header from '../../../common/components/header/header.component'
import NetworkList from './network-list'
import { useNavigate } from 'react-router-dom'
import { useNetworks } from '../../../common/hooks/networks.hooks'

const NetworkComponent = () => {
  const navigate = useNavigate()
  const { networks } = useNetworks()

  if (!networks) {
    return null
  }

  return (
    <FlexColumnDiv>
      <Header title={intl.get('NETWORK')} image={Router} />
      <NetworkList onSelect={({ label }) => navigate(label)} networks={networks} />
    </FlexColumnDiv>
  )
}

export default NetworkComponent
