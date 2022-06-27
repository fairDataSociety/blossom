import React, { useEffect, useRef } from 'react'
import { styled } from '@mui/system'
import { Typography } from '@mui/material'
import { Account } from '../../../../model/general.types'
import ClipboardButton from '../../../common/components/clipboard-button/clipboard-button.component'
import { getAccountBalance } from '../../../../messaging/content-api.messaging'

export interface WaitingPaymentProps {
  account: Account
  onPaymentDetected: () => void
  onError: () => void
}

const ContainerDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  margin: '20px auto 0 auto',
})

const WaitingPayment = ({ account, onPaymentDetected, onError }: WaitingPaymentProps) => {
  const timer = useRef<NodeJS.Timeout>()

  const checkPayment = async () => {
    try {
      const balance = await getAccountBalance(account)

      if (balance.gt(0)) {
        closeTimer()
        onPaymentDetected()
      }
    } catch (error) {
      console.error(error)
      closeTimer()
      onError()
    }
  }

  const closeTimer = () => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }

  useEffect(() => {
    timer.current = setInterval(checkPayment, 10000)

    return closeTimer
  }, [])

  return (
    <ContainerDiv>
      <Typography variant="h5" sx={{ margin: 'auto' }}>
        <span data-testid="account">{account}</span>
        <ClipboardButton text={account} />
      </Typography>
    </ContainerDiv>
  )
}

export default WaitingPayment
