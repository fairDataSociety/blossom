import React, { useState } from 'react'
import intl from 'react-intl-universal'
import { useForm } from 'react-hook-form'
import { Button, Checkbox, FormControlLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import Wrapper from '../components/wrapper'
import Title from '../../../common/components/title/title.component'
import Form from '../../../common/components/form/form.component'
import ErrorMessage from '../../../common/components/error-message/error-message.component'
import { useNetworks } from '../../../common/hooks/networks.hooks'
import FieldSpinner from '../../../common/components/field-spinner/field-spinner.component'
import { importAccount } from '../../../../messaging/content-api.messaging'
import ImportComplete from './import-complete'

interface FormFields {
  name: string
  password: string
  mnemonic: string
  networkLabel: string
}

const Import = () => {
  const {
    register,
    handleSubmit,
    clearErrors,
    setError: setFieldError,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FormFields>()
  const { networks, selectedNetwork } = useNetworks()
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false)
  const [error, setError] = useState<string>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)

  const onPasswordChange = (password: string) => {
    setValue('password', password)

    if (isSubmitted) {
      validatePassword(password)
    }
  }

  const validatePassword = (password: string): string => {
    let message: string = null

    if (!password) {
      message = intl.get('PASSWORD_REQUIRED_ERROR')
    } else if (password.length < 8) {
      message = intl.get('PASSWORD_TOO_SHORT')
    }
    // TODO check if password contains lowercase and uppercase letters

    if (message) {
      setFieldError('password', { message })
    } else {
      clearErrors('password')
    }

    return message
  }

  const onSubmit = async ({ name, password, mnemonic, networkLabel }: FormFields) => {
    setError(null)

    if (validatePassword(password)) {
      return
    }

    if (mnemonic.trim().split(' ').length !== 12) {
      return setError(intl.get('INVALID_MEMONIC'))
    }

    setLoading(true)

    try {
      await importAccount({
        name,
        password,
        mnemonic,
        network: networks.find((network) => network.label === networkLabel),
      })

      setCompleted(true)
    } catch (error) {
      console.error(error)

      if (typeof error === 'string') {
        if (error.includes('Invalid mnemonic')) {
          return setError(intl.get('INVALID_MEMONIC'))
        }

        if (error.includes('Account already exists')) {
          return setError(intl.get('ACCOUNT_ALREADY_EXISTS'))
        }
      }
      setError(intl.get('GENERAL_ERROR_MESSAGE'))
    } finally {
      setLoading(false)
    }
  }

  if (!networks) {
    return null
  }

  if (completed) {
    return <ImportComplete />
  }

  return (
    <Wrapper>
      <Title>{intl.get('IMPORT_TITLE')}</Title>
      <Typography
        variant="body1"
        align="center"
        sx={{
          marginTop: '20px',
        }}
      >
        {intl.get('IMPORT_ACCOUNT_INSTRUCTIONS')}
      </Typography>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label={intl.get('ACCOUNT_NAME')}
          variant="outlined"
          fullWidth
          {...register('name', { required: true })}
          error={Boolean(errors.name)}
          helperText={errors.name && intl.get('ACCOUNT_NAME_REQUIRED')}
          data-testid="account-name-input"
        />
        <TextField
          label={intl.get('PASSWORD')}
          variant="outlined"
          type="password"
          fullWidth
          {...register('password', { required: true })}
          onChange={(event) => onPasswordChange(event.target.value)}
          error={Boolean(errors.password)}
          helperText={errors.password && (errors.password.message || intl.get('PASSWORD_REQUIRED_ERROR'))}
          data-testid="password-input"
        />
        <TextField
          label={intl.get('RECOVERY_PHRASE')}
          variant="outlined"
          fullWidth
          type={showMnemonic ? 'text' : 'password'}
          sx={{ marginTop: '20px' }}
          {...register('mnemonic', { required: true })}
          error={Boolean(errors.mnemonic)}
          helperText={errors.mnemonic && intl.get('MNEMONIC_REQUIRED')}
          data-testid="mnemonic-input"
        />
        <div>
          <FormControlLabel
            control={<Checkbox value={showMnemonic} onChange={() => setShowMnemonic(!showMnemonic)} />}
            label={intl.get('SHOW_RECOVERY_PHRASE')}
            sx={{ marginBottom: '20px' }}
          />
        </div>
        <div>
          <Select
            defaultValue={selectedNetwork.label}
            variant="outlined"
            fullWidth
            {...register('networkLabel', { required: true })}
          >
            {networks.map(({ label }) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button
          color="primary"
          variant="contained"
          size="large"
          data-testid="submit"
          disabled={loading}
          type="submit"
          sx={{
            padding: '10px 50px',
            margin: '50px auto 0 auto',
          }}
        >
          {intl.get('IMPORT')}
          {loading && <FieldSpinner />}
        </Button>
      </Form>
    </Wrapper>
  )
}

export default Import
