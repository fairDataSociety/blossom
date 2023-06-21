import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import WalletImage from '@mui/icons-material/Wallet'
import { FlexColumnDiv } from '../../utils/utils'
import Header from '../../../../settings/components/header/header.component'
import { getCurrentUser } from '../../../../../messaging/content-api.messaging'
import { UserResponse } from '../../../../../model/internal-messages.model'
import ErrorMessage from '../../error-message/error-message.component'
import WalletOverview from './wallet-overview'

const Wallet = () => {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const user = await getCurrentUser()

      setUser(user)
    } catch (error) {
      setError(String(error))
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <FlexColumnDiv>
      <Header title={intl.get('WALLET')} image={WalletImage} />
      {user && <WalletOverview user={user} />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FlexColumnDiv>
  )
}

export default Wallet
