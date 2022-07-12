import React from 'react'
import intl from 'react-intl-universal'
import { Stack, Typography } from '@mui/material'
import Router from '@mui/icons-material/Router'
import Section from './section.component'
import { useNavigate } from 'react-router-dom'
import RouteCodes from '../../routes/route-codes'

const Main = () => {
  const navigate = useNavigate()

  return (
    <>
      <Typography variant="h5" align="center">
        {intl.get('SETTINGS')}
      </Typography>
      <Stack spacing={2} sx={{ paddingTop: '20px' }}>
        <Section
          description={intl.get('NETWORK_SETTINGS_DESCRIPTION')}
          image={<Router />}
          onClick={() => navigate(RouteCodes.network)}
        >
          {intl.get('NETWORK')}
        </Section>
      </Stack>
    </>
  )
}

export default Main
