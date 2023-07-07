import React, { useState } from 'react'
import intl from 'react-intl-universal'
import Form from '../../form/form.component'
import { useForm } from 'react-hook-form'
import { Button, TextField, Typography } from '@mui/material'
import FieldSpinner from '../../field-spinner/field-spinner.component'
import { unlockWallet } from '../../../../../messaging/content-api.messaging'
import ErrorMessage from '../../error-message/error-message.component'

interface WalletLockProps {
  onUnlock: () => void
}

interface FormFields {
  password: string
}

const WalletLock = ({ onUnlock }: WalletLockProps) => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const onSubmit = async ({ password }: FormFields) => {
    try {
      setLoading(true)
      await unlockWallet(password)
      onUnlock()
    } catch (error) {
      setError(String(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="body1">{intl.get('UNLOCK_WALLET')}</Typography>
      <TextField
        label={intl.get('PASSWORD')}
        variant="outlined"
        type="password"
        disabled={loading}
        fullWidth
        {...register('password', { required: true })}
        error={Boolean(errors.password)}
        helperText={errors.password && intl.get('PASSWORD_REQUIRED_ERROR')}
        data-testid="password"
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
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
        {intl.get('LOGIN')}
        {loading && <FieldSpinner />}
      </Button>
    </Form>
  )
}

export default WalletLock
