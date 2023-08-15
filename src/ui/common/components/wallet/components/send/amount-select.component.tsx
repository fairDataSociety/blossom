import React, { useState } from 'react'
import intl from 'react-intl-universal'
import Close from '@mui/icons-material/Close'
import Form from '../../../form/form.component'
import { useForm } from 'react-hook-form'
import { Button, IconButton, Paper, TextField } from '@mui/material'
import { Address, BigNumberString } from '../../../../../../model/general.types'
import { FlexColumnDiv } from '../../../utils/utils'
import GasEstimation from '../gas-estimation.component'
import { convertFromDecimal, isAddressValid, isValueValid, valueRegex } from '../../../../utils/ethers'
import { UserResponse } from '../../../../../../model/internal-messages.model'
import { useWalletLock } from '../../hooks/wallet-lock.hook'
import { Token } from '../../../../../../model/storage/wallet.model'

export interface AmountSelectProps {
  address: Address
  user: UserResponse
  rpcUrl: string
  selectedToken: Token
  onCancel: () => void
  onSubmit: (value: BigNumberString) => void
}
export interface FormFields {
  amount: string
}

const AmountSelect = ({ address, user, rpcUrl, selectedToken, onCancel, onSubmit }: AmountSelectProps) => {
  const [value, setValue] = useState<BigNumberString>('')
  useWalletLock()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const getValue = () => {
    if (!isValueValid(value)) {
      return '100000000000'
    }

    return convertFromDecimal(value, selectedToken?.decimals).toString()
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
          {...register('amount', { required: true, min: 0.000000001, pattern: valueRegex })}
          onChange={(event) => setValue(event.target.value)}
          error={Boolean(errors.amount)}
          helperText={errors.amount && intl.get('AMOUNT_ERROR')}
          data-testid="amount-input"
        />
        <GasEstimation
          to={isAddressValid(address) ? address : user.address}
          value={getValue()}
          tokenAddress={selectedToken?.address}
          rpcUrl={rpcUrl}
          sx={{ margin: 'auto', marginTop: '10px' }}
        />
        <Button
          color="primary"
          variant="contained"
          type="submit"
          size="large"
          data-testid="amount-submit"
          sx={{
            marginTop: '50px',
          }}
        >
          {intl.get('SEND')}
        </Button>
      </Form>
    </FlexColumnDiv>
  )
}

export default AmountSelect