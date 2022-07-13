import React from 'react'
import intl from 'react-intl-universal'
import { Stack, Typography } from '@mui/material'
import Router from '@mui/icons-material/Router'
import VpnKey from '@mui/icons-material/VpnKey'
import Hive from '@mui/icons-material/Hive'
import Section from './section.component'
import { useNavigate } from 'react-router-dom'
import RouteCodes from '../../routes/route-codes'
import { openAuthPage } from '../../../../messaging/content-api.messaging'

const Main = () => {
  const navigate = useNavigate()

  return (
    <>
      <Typography variant="h5" align="center">
        {intl.get('SETTINGS')}
      </Typography>
      <Stack spacing={3} sx={{ paddingTop: '20px' }}>
        <Section
          description={intl.get('LOGIN_REGISTER_DESCRIPTION')}
          image={<VpnKey />}
          onClick={openAuthPage}
        >
          {intl.get('LOGIN_OR_REGISTER')}
        </Section>
        <Section
          description={intl.get('NETWORK_SETTINGS_DESCRIPTION')}
          image={<Router />}
          onClick={() => navigate(RouteCodes.network)}
        >
          {intl.get('NETWORK')}
        </Section>
        <Section
          description={intl.get('SWARM_DESCRIPTION')}
          image={<Hive />}
          onClick={() => navigate(RouteCodes.swarm)}
        >
          {intl.get('SWARM')}
        </Section>
      </Stack>
    </>
  )
}

export default Main
