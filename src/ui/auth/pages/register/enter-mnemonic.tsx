import React, { useState } from 'react'
import intl from 'react-intl-universal'
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import ErrorMessage from '../../../common/components/error-message/error-message.component'
import { useForm } from 'react-hook-form'

interface FormFields {
  mnemonic: string
}

interface EnterMnemonicProps {
  onSubmit: (mnemonic: string) => void
}

const EnterMnemonic = ({ onSubmit }: EnterMnemonicProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false)
  const [error, setError] = useState<string>(null)

  const onSubmitInternal = ({ mnemonic }: FormFields) => {
    if (mnemonic.trim().split(' ').length !== 12) {
      return setError(intl.get('INVALID_MEMONIC'))
    }

    setError(null)

    onSubmit(mnemonic)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitInternal)}>
      <TextField
        {...register('mnemonic', { required: true })}
        placeholder={intl.get('RECOVERY_PHRASE')}
        variant="outlined"
        type={showMnemonic ? 'text' : 'password'}
        sx={{ marginTop: '20px' }}
        error={Boolean(errors.mnemonic)}
        helperText={errors.mnemonic && intl.get('MNEMONIC_REQUIRED')}
        fullWidth
        data-testid="mnemonic-input"
      />
      <div>
        <FormControlLabel
          control={<Checkbox value={showMnemonic} onChange={() => setShowMnemonic(!showMnemonic)} />}
          label={intl.get('SHOW_RECOVERY_PHRASE')}
          sx={{ margin: '20px 0' }}
        />
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button
        color="primary"
        variant="contained"
        size="large"
        data-testid="submit"
        type="submit"
        sx={{
          padding: '10px 50px',
          margin: '50px auto 0 auto',
        }}
      >
        {intl.get('CONFIRM')}
      </Button>
    </form>
  )
}

export default EnterMnemonic
