import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import Wallet from '@mui/icons-material/Wallet'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import Header from '../../../common/components/header/header.component'
import LayersClear from '@mui/icons-material/LayersClear'
import { clearWalletData, getCurrentUser } from '../../../../messaging/content-api.messaging'
import { useNavigate } from 'react-router-dom'
import RouteCodes from '../../routes/route-codes'
import Section from '../../components/section/section.component'
import ConfirmationDialog from '../../../common/components/confirmation-dialog/confirmation-dialog.component'

const WalletConfig = () => {
  const navigate = useNavigate()
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState<boolean>(false)

  const loadData = async () => {
    const user = await getCurrentUser()

    if (!user) {
      navigate(RouteCodes.settings)
    }
  }

  const clearActivityData = async () => {
    await clearWalletData()

    setClearDataDialogOpen(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <FlexColumnDiv>
      <Header title={intl.get('WALLET')} image={Wallet} backRoute={RouteCodes.settings} />
      <Section
        description={intl.get('CLEAR_ACTIVITY_DATA_DESCRIPTION')}
        image={<LayersClear />}
        onClick={() => setClearDataDialogOpen(true)}
        data-testid="clear-activity-data-button"
      >
        {intl.get('CLEAR_ACTIVITY_DATA')}
      </Section>
      <ConfirmationDialog
        open={clearDataDialogOpen}
        onCancel={() => setClearDataDialogOpen(false)}
        onConfirm={clearActivityData}
        title={intl.get('CLEAR_ACTIVITY_DATA')}
      >
        {intl.get('CLEAR_ACTIVITY_DATA_CONFIRMATION')}
      </ConfirmationDialog>
    </FlexColumnDiv>
  )
}

export default WalletConfig
