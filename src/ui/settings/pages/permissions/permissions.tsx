import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import Security from '@mui/icons-material/Security'
import { FlexColumnDiv, MarginAuto } from '../../../common/components/utils/utils'
import Header from '../../components/header/header.component'
import { getAllDappIds } from '../../../../messaging/content-api.messaging'
import { CircularProgress } from '@mui/material'
import ErrorMessage from '../../../common/components/error-message/error-message.component'
import DappPermissionsList from './dapp-id-list.component'
import { useNavigate } from 'react-router-dom'
import { DappId } from '../../../../model/general.types'

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

  if (loading) {
    return (
      <MarginAuto>
        <CircularProgress size="small" sx={{ margin: 'auto' }} />
      </MarginAuto>
    )
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>
  }

  return (
    <FlexColumnDiv>
      <Header title={intl.get('DAPP_PERMISSIONS')} image={Security} />

      {dappIds.length ? (
        <DappPermissionsList dappIds={dappIds} onSelect={(dappId) => navigate(dappId)} />
      ) : (
        <MarginAuto>{intl.get('NO_PERMISSIONS')}</MarginAuto>
      )}
    </FlexColumnDiv>
  )
}

export default Permissions
