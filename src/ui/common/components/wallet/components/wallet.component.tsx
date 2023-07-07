import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import WalletImage from '@mui/icons-material/Wallet'
import { FlexColumnDiv } from '../../utils/utils'
import Header from '../../header/header.component'
import ErrorMessage from '../../error-message/error-message.component'
import WalletOverview from './wallet-overview.component'
import { useUser } from '../../../hooks/user.hooks'
import { refreshWalletLock } from '../../../../../messaging/content-api.messaging'
import WalletLock from './wallet-lock.component'

const Wallet = () => {
  const [locked, setLocked] = useState<boolean | null>(null)
  const { user, error } = useUser()

  const checkLock = async () => {
    try {
      await refreshWalletLock()

      setLocked(false)
    } catch (error) {
      setLocked(true)
    }
  }

  useEffect(() => {
    checkLock()
  }, [])

  return (
    <FlexColumnDiv>
      <Header title={intl.get('WALLET')} image={WalletImage} showOpenPage />
      {user &&
        locked !== null &&
        (locked ? <WalletLock onUnlock={() => setLocked(false)} /> : <WalletOverview user={user} />)}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FlexColumnDiv>
  )
}

export default Wallet
