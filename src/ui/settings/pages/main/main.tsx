import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import { Stack, Typography } from '@mui/material'
import Router from '@mui/icons-material/Router'
import VpnKey from '@mui/icons-material/VpnKey'
import Hive from '@mui/icons-material/Hive'
import Security from '@mui/icons-material/Security'
import Wallet from '@mui/icons-material/Wallet'
import Section from './section.component'
import { useNavigate } from 'react-router-dom'
import RouteCodes from '../../routes/route-codes'
import {
  getCurrentUser,
  getGlobalError,
  logout,
  openAuthPage,
} from '../../../../messaging/content-api.messaging'
import { UserResponse } from '../../../../model/internal-messages.model'
import UserInfo from './user-info.component'
import ErrorMessage from '../../../common/components/error-message/error-message.component'

const Main = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserResponse>(null)
  const [globalError, setGlobalError] = useState<string | undefined>(undefined)

  const loadData = async () => {
    const [user, globalError] = await Promise.all([getCurrentUser(), getGlobalError()])

    setUser(user)
    setGlobalError(globalError)
  }

  const onLoginOrRegister = async () => {
    await openAuthPage()
    loadData()
  }

  const onLogout = async () => {
    await logout()
    loadData()
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <>
      <Typography variant="h5" align="center">
        Blossom
      </Typography>
      {globalError && <ErrorMessage>{intl.get(globalError)}</ErrorMessage>}
      <Stack spacing={3} sx={{ paddingTop: '20px' }}>
        {user ? (
          <UserInfo user={user} onLogout={onLogout} />
        ) : (
          <Section
            description={intl.get('LOGIN_REGISTER_DESCRIPTION')}
            image={<VpnKey />}
            onClick={onLoginOrRegister}
            dataTestId="settings-registration-login"
          >
            {intl.get('LOGIN_OR_REGISTER')}
          </Section>
        )}
        {user && (
          <>
            <Section
              description={intl.get('DAPP_PERMISSIONS_DESCRIPTION')}
              image={<Security />}
              onClick={() => navigate(RouteCodes.permissions)}
              dataTestId="settings-permissions"
            >
              {intl.get('DAPP_PERMISSIONS')}
            </Section>
            <Section
              description={intl.get('WALLET_DESCRIPTION')}
              image={<Wallet />}
              onClick={() => navigate(RouteCodes.wallet)}
              dataTestId="wallet"
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
    </>
  )
}

export default Main
