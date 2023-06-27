import React, { useEffect, useRef, useState } from 'react'
import intl from 'react-intl-universal'
import { Card, CardContent, Grow, Typography } from '@mui/material'
import { Address, BigNumberString } from '../../../../../model/general.types'
import { estimateGasPrice } from '../../../../../messaging/content-api.messaging'
import { BigNumber, utils } from 'ethers'
import { SxProps, Theme } from '@mui/system'
import ErrorMessage from '../../error-message/error-message.component'

const CHECK_INTERVAL = 30000

export interface GasEstimationProps {
  to: Address
  value: BigNumberString
  rpcUrl: string
  sx?: SxProps<Theme>
  onGasEstimationUpdate?: (gasPriceEstimation: BigNumber) => void
}

const GasEstimation = ({ to, value, rpcUrl, sx, onGasEstimationUpdate }: GasEstimationProps) => {
  const [gasPrice, setGasPrice] = useState<BigNumber | null>(null)
  const [show, setShow] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const checkGasPrice = async () => {
    try {
      setError(null)
      const gasPrice = await estimateGasPrice({
        to,
        value,
        rpcUrl,
      })

      setShow(false)
      setGasPrice(gasPrice)
      setTimeout(() => setShow(true), 300)

      if (onGasEstimationUpdate) {
        onGasEstimationUpdate(gasPrice)
      }
    } catch (error) {
      setError(error)
    }

    closeTimeout()

    timeoutRef.current = setTimeout(checkGasPrice, CHECK_INTERVAL)
  }

  const closeTimeout = () => clearTimeout(timeoutRef.current)

  useEffect(() => {
    timeoutRef.current = setTimeout(checkGasPrice)

    return closeTimeout
  }, [])

  if (!gasPrice && !error) {
    return null
  }

  return (
    <Grow in={show}>
      <Card sx={{ ...sx, maxWidth: '280px' }}>
        <CardContent>
          <Typography color="text.secondary" gutterBottom>
            {intl.get('ESTIMATED_GAS_PRICE')}:
          </Typography>
          {error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            <>
              <Typography variant="h6" component="div">
                {utils.formatEther(gasPrice)}
              </Typography>
              <Typography variant="body2">{intl.get('GAS_PRICE_DISCLAIMER')}</Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Grow>
  )
}

export default GasEstimation
