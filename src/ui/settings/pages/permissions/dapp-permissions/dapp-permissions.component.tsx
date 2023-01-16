import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import Security from '@mui/icons-material/Security'
import { useNavigate, useParams } from 'react-router-dom'
import { FlexColumnDiv } from '../../../../common/components/utils/utils'
import Header from '../../../components/header/header.component'
import RouteCodes from '../../../routes/route-codes'
import DappPermissionsForm from './dapp-permissions-form.component'
import { Dapp } from '../../../../../model/storage/dapps.model'
import { getDappSettings, updateDappSettings } from '../../../../../messaging/content-api.messaging'

const DappPermissions = () => {
  const navigate = useNavigate()
  const { dappId } = useParams()

  const [dapp, setDapp] = useState<Dapp>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchDapp = async () => {
    const dapp = await getDappSettings(dappId)

    setDapp(dapp)
  }

  useEffect(() => {
    fetchDapp()
  }, [])

  const onUpdatePermissions = async (dapp: Dapp) => {
    try {
      setLoading(true)

      await updateDappSettings(dapp)

      navigate(RouteCodes.permissions)
    } catch (error) {
      // TODO handle errors
    } finally {
      setLoading(false)
    }
  }

  if (!dapp) {
    return null
  }

  return (
    <FlexColumnDiv>
      <Header title={intl.get('DAPP_PERMISSIONS')} image={Security} backRoute={RouteCodes.permissions} />
      <DappPermissionsForm dapp={dapp} disabled={loading} onUpdate={onUpdatePermissions} />
    </FlexColumnDiv>
  )
}

export default DappPermissions
