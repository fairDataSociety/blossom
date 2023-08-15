import React from 'react'
import intl from 'react-intl-universal'
import Form from '../../../form/form.component'
import { Controller, useForm } from 'react-hook-form'
import { Autocomplete, Button, TextField, Typography } from '@mui/material'
import FieldSpinner from '../../../field-spinner/field-spinner.component'
import { Address } from '../../../../../../model/general.types'
import { addressRegex } from '../../../../utils/ethers'
import { useWalletLock } from '../../hooks/wallet-lock.hook'

interface AddressSelectProps {
  addresses: Address[]
  disabled: boolean
  onSubmit: (address: string) => void
}

interface FormFields {
  address: Address
}

const AddressSelect = ({ addresses, disabled, onSubmit }: AddressSelectProps) => {
  useWalletLock()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormFields>()

  return (
    <Form onSubmit={handleSubmit(({ address }) => onSubmit(address))}>
      <Typography variant="body1" sx={{ marginBottom: '20px' }}>
        {intl.get('SELECT_ADDRESS')}:
      </Typography>
      <Controller
        render={() => (
          <Autocomplete
            freeSolo
            options={addresses}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                label={intl.get('ADDRESS')}
                placeholder="0x..."
                disabled={disabled}
                {...register('address', { required: true, pattern: addressRegex })}
                error={Boolean(errors.address)}
                helperText={errors.address && intl.get('ADDRESS_ERROR')}
                data-testid="address-input"
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
        disabled={disabled}
        data-testid="address-submit"
        sx={{
          marginTop: '50px',
        }}
      >
        {intl.get('SELECT')}
        {disabled && <FieldSpinner />}
      </Button>
    </Form>
  )
}

export default AddressSelect