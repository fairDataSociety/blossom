import React, { useState } from 'react'
import intl from 'react-intl-universal'
import Form from '../../form/form.component'
import { Controller, useForm } from 'react-hook-form'
import WalletImage from '@mui/icons-material/Wallet'
import CheckCircle from '@mui/icons-material/CheckCircle'
import { Autocomplete, Button, TextField, Typography } from '@mui/material'
import FieldSpinner from '../../field-spinner/field-spinner.component'
import { Address } from '../../../../../model/general.types'
import { FlexColumnDiv } from '../../utils/utils'
import Header from '../../header/header.component'
import { useWallet } from '../context/wallet.context'
import GasEstimation from './gas-estimation.component'
import { sendTransaction } from '../../../../../messaging/content-api.messaging'
import { utils } from 'ethers'
import { useUser } from '../../../hooks/user.hooks'
import { addressRegex, isAddressValid, isValueValid, valueRegex } from '../../../utils/ethers'
import ErrorMessage from '../../error-message/error-message.component'
import { useNavigate } from 'react-router-dom'

interface FormFields {
  amount: string
  address: Address
}

const WalletSend = () => {
  const [value, setValue] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const navigate = useNavigate()
  const { walletNetwork } = useWallet()
  const { user, error: userError } = useUser()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormFields>()

  const getRpcUrl = () => walletNetwork?.rpc || user.network.rpc

  const getError = () => userError || error

  const onSubmit = async ({ amount, address }: FormFields) => {
    try {
      setLoading(true)

      await sendTransaction({
        to: address,
        rpcUrl: getRpcUrl(),
        value: utils.parseUnits(amount, 'ether').toString(),
      })
      setCompleted(true)
    } catch (error) {
      console.error(error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setValue('')
    setAddress('')
    setError('')
    setCompleted(false)
  }

  return (
    <FlexColumnDiv>
      <Header title={intl.get('WALLET')} image={WalletImage} showOpenPage />
      {getError() && <ErrorMessage>{getError()}</ErrorMessage>}
      {completed ? (
        <>
          <FlexColumnDiv sx={{ marginTop: '20px' }}>
            <CheckCircle color="success" sx={{ margin: '0 auto' }} />
            <Typography align="center" variant="body1">
              {intl.get('TRANSACTION_COMPLETE')}
            </Typography>
          </FlexColumnDiv>
          <Button
            color="primary"
            variant="contained"
            sx={{
              marginTop: '20px',
            }}
            onClick={reset}
          >
            {intl.get('SEND_ANOTHER')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            sx={{
              marginTop: '20px',
            }}
            onClick={() => navigate('..')}
          >
            {intl.get('BACK')}
          </Button>
        </>
      ) : (
        user && (
          <>
            <GasEstimation
              to={isAddressValid(address) ? address : user.address}
              value={isValueValid(value) ? value : '100000000000'}
              rpcUrl={getRpcUrl()}
              sx={{ margin: 'auto', marginTop: '10px' }}
            />
            <Form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label={intl.get('AMOUNT')}
                variant="outlined"
                fullWidth
                placeholder="0.0"
                disabled={loading}
                {...register('amount', { required: true, min: 0.000000001, pattern: valueRegex })}
                onChange={(event) => setValue(event.target.value)}
                error={Boolean(errors.amount)}
                helperText={errors.amount && intl.get('AMOUNT_ERROR')}
                data-testid="amount"
              />
              <Controller
                render={() => (
                  <Autocomplete
                    freeSolo
                    options={[]}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={intl.get('ADDRESS')}
                        placeholder="0x..."
                        disabled={loading}
                        {...register('address', { required: true, pattern: addressRegex })}
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        error={Boolean(errors.address)}
                        helperText={errors.address && intl.get('ADDRESS_ERROR')}
                      />
                    )}
                  />
                )}
                name="address"
                control={control}
              />
              <Button
                color="primary"
                variant="contained"
                type="submit"
                size="large"
                disabled={loading}
                data-testid="submit"
                sx={{
                  marginTop: '50px',
                }}
              >
                {intl.get('SEND')}
                {loading && <FieldSpinner />}
              </Button>
            </Form>
          </>
        )
      )}
    </FlexColumnDiv>
  )
}

export default WalletSend
