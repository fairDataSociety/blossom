import React from 'react'
import intl from 'react-intl-universal'
import WalletImage from '@mui/icons-material/Wallet'
import { FlexColumnDiv } from '../../utils/utils'
import Header from '../../header/header.component'
import ErrorMessage from '../../error-message/error-message.component'
import WalletOverview from './wallet-overview.component'
import { useUser } from '../../../hooks/user.hooks'

const Wallet = () => {
  const { user, error } = useUser()

  return (
    <FlexColumnDiv>
      <Header title={intl.get('WALLET')} image={WalletImage} />
      {user && <WalletOverview user={user} />}
      {/* TODO Show lock screen if locked */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FlexColumnDiv>
  )
}

export default Wallet
