import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import { Stack } from '@mui/material'
import Settings from '@mui/icons-material/Settings'
import Router from '@mui/icons-material/Router'
import Hive from '@mui/icons-material/Hive'
import Wallet from '@mui/icons-material/Wallet'
import { useNavigate } from 'react-router-dom'
import RouteCodes from '../../routes/route-codes'
import { getCurrentUser } from '../../../../messaging/content-api.messaging'
import { UserResponse } from '../../../../model/internal-messages.model'
import Section from '../../components/section/section.component'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import Header from '../../../common/components/header/header.component'

const Configuration = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserResponse>(null)

  const loadData = async () => {
    const user = await getCurrentUser()

    setUser(user)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <FlexColumnDiv>
      <Header title={intl.get('SETTINGS')} image={Settings} />
      <Stack spacing={3} sx={{ paddingTop: '20px' }}>
        {user && (
          <>
            <Section
              description={intl.get('WALLET_CONFIG_DESCRIPTION')}
              image={<Wallet />}
              onClick={() => navigate(RouteCodes.walletConfig)}
              dataTestId="wallet-config"
            >
              {intl.get('WALLET')}
            </Section>
          </>
        )}
        <Section
          description={intl.get('NETWORK_SETTINGS_DESCRIPTION')}
          image={<Router />}
          onClick={() => navigate(RouteCodes.network)}
          dataTestId="settings-network"
        >
          {intl.get('NETWORK')}
        </Section>
        <Section
          description={intl.get('SWARM_DESCRIPTION')}
          image={<Hive />}
          onClick={() => navigate(RouteCodes.swarm)}
          dataTestId="settings-swarm"
        >
          {intl.get('SWARM')}
        </Section>
      </Stack>
    </FlexColumnDiv>
  )
}

export default Configuration
