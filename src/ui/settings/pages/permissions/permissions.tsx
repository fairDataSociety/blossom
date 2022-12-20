import React, { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import intl from 'react-intl-universal'
import Security from '@mui/icons-material/Security'
import { MarginAuto } from '../../../common/components/utils/utils'
import Header from '../../components/header/header.component'
import { getAllDappIds } from '../../../../messaging/content-api.messaging'
import { CircularProgress, Typography } from '@mui/material'
import ErrorMessage from '../../../common/components/error-message/error-message.component'
import DappPermissionsList from './dapp-id-list.component'
import { useNavigate } from 'react-router-dom'
import { DappId } from '../../../../model/general.types'

export const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
})

const Permissions = () => {
  const [dappIds, setDappIds] = useState<DappId[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const loadDappIds = async () => {
    try {
      const dappIds = await getAllDappIds()

      setDappIds(dappIds)
    } catch (error) {
      setError(String(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDappIds()
  }, [])

  const renderContent = () => {
    if (loading) {
      return <CircularProgress size="small" sx={{ margin: 'auto' }} />
    }

    if (error) {
      return (
        <MarginAuto>
          <ErrorMessage>{error}</ErrorMessage>
        </MarginAuto>
      )
    }

    return dappIds.length ? (
      <DappPermissionsList dappIds={dappIds} onSelect={(dappId) => navigate(dappId)} />
    ) : (
      <Typography variant="subtitle2" align="center" fontStyle="italic" sx={{ marginTop: '10px' }}>
        {intl.get('NO_PERMISSIONS')}
      </Typography>
    )
  }

  return (
    <Wrapper>
      <Header title={intl.get('DAPP_PERMISSIONS')} image={Security} />

      {renderContent()}
    </Wrapper>
  )
}

export default Permissions
