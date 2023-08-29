import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import Close from '@mui/icons-material/Close'
import Form from '../../../form/form.component'
import { useForm } from 'react-hook-form'
import { Button, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import { Address, BigNumberString } from '../../../../../../model/general.types'
import { FlexColumnDiv } from '../../../utils/utils'
import GasEstimation from '../gas-estimation.component'
import { convertFromDecimal, isAddressValid, isValueValid, valueRegex } from '../../../../utils/ethers'
import { UserResponse } from '../../../../../../model/internal-messages.model'
import { useWalletLock } from '../../hooks/wallet-lock.hook'
import { BigNumber, utils } from 'ethers'
import { useWallet } from '../../context/wallet.context'
import { getAccountBalance, getTokenBalance } from '../../../../../../messaging/content-api.messaging'

export interface AmountSelectProps {
  address: Address
  user: UserResponse
  rpcUrl: string
  onCancel: () => void
  onSubmit: (value: BigNumberString) => void
}
export interface FormFields {
  amount: string
}

const AmountSelect = ({ address, user, rpcUrl, onCancel, onSubmit }: AmountSelectProps) => {
  const [value, setValue] = useState<BigNumberString>('')
  const [balance, setBalance] = useState<BigNumber | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { walletNetwork, selectedToken } = useWallet()

  const selectedNetwork = walletNetwork || user.network

  useWalletLock()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const loadBalance = async () => {
    try {
      const balance = await (selectedToken
        ? getTokenBalance(selectedToken, selectedNetwork.rpc)
        : getAccountBalance(user.address, selectedNetwork.rpc))

      setBalance(balance)
    } catch (error) {
      // Not a critical error
      console.warn(error)
    } finally {
      setLoading(false)
    }
  }

  const getValue = () => {
    if (!isValueValid(value)) {
      return '1'
    }

    return convertFromDecimal(value, selectedToken?.decimals).toString()
  }

  useEffect(() => {
    loadBalance()
  }, [])

  let notEnoughBalance: boolean

  try {
    notEnoughBalance = balance ? utils.parseEther(value || '0').gt(balance) : false
  } catch (error) {
    // ignore
  }

  return (
    <FlexColumnDiv>
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          overflowWrap: 'anywhere',
        }}
      >
        {address}
        <IconButton onClick={onCancel} sx={{ marginLeft: 'auto' }}>
          <Close />
        </IconButton>
      </Paper>
      <Form onSubmit={handleSubmit(({ amount }) => onSubmit(amount))}>
        <TextField
          label={intl.get('AMOUNT')}
          variant="outlined"
          fullWidth
          placeholder="0.0"
          InputProps={{
            endAdornment: <InputAdornment position="end">{selectedToken?.symbol || 'ETH'}</InputAdornment>,
          }}
          {...register('amount', { required: true, min: 0.000000001, pattern: valueRegex })}
          onChange={(event) => setValue(event.target.value)}
          error={Boolean(errors.amount)}
          helperText={errors.amount && intl.get('AMOUNT_ERROR')}
          data-testid="amount-input"
        />
        <GasEstimation
          to={isAddressValid(address) ? address : user.address}
          value={getValue()}
          token={selectedToken}
          rpcUrl={rpcUrl}
          sx={{ margin: 'auto', marginTop: '10px' }}
        />
        <Button
          color="primary"
          variant="contained"
          type="submit"
          size="large"
          data-testid="amount-submit"
          disabled={notEnoughBalance || loading}
          sx={{
            marginTop: '50px',
          }}
        >
          {intl.get('SEND')}
        </Button>
        {notEnoughBalance && (
          <Typography variant="body2" color="gray" sx={{ marginTop: '5px' }}>
            {intl.get('NOT_ENOUGH_BALANCE')}
          </Typography>
        )}
      </Form>
    </FlexColumnDiv>
  )
}

export default AmountSelect
