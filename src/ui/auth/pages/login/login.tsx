import React, { useState } from 'react'
import intl from 'react-intl-universal'
import { useForm } from 'react-hook-form'
import { Button, MenuItem, Select, TextField } from '@mui/material'
import Title from '../../../common/components/title/title.component'
import Form from '../../../common/components/form/form.component'
import ErrorMessage from '../../../common/components/error-message/error-message.component'
import FieldSpinner from '../../../common/components/field-spinner/field-spinner.component'
import { login } from '../../../../messaging/content-api.messaging'
import Wrapper from '../components/wrapper'
import { useNetworks } from '../../../hooks/networks.hooks'

interface FormFields {
  username: string
  password: string
  networkLabel: string
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const networks = useNetworks()

  const onSubmit = async ({ username, password, networkLabel }: FormFields) => {
    setError(null)
    setLoading(true)

    try {
      await login({
        username,
        password,
        network: networks.find((network) => network.label === networkLabel),
      })
    } catch (error) {
      console.error(error)

      if (typeof error === 'string') {
        if (error.includes('Incorrect password')) {
          return setError(intl.get('INVALID_PASSWORD'))
        }

        if (error.includes('does not exists')) {
          return setError(intl.get('INVALID_USERNAME'))
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

  return (
    <Wrapper>
      <Title>{intl.get('LOGIN_TITLE')}</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label={intl.get('USERNAME')}
          variant="outlined"
          fullWidth
          {...register('username', { required: true })}
          error={Boolean(errors.username)}
          helperText={errors.username && intl.get('USERNAME_REQUIRED_ERROR')}
          data-testid="username"
        />
        <TextField
          label={intl.get('PASSWORD')}
          variant="outlined"
          type="password"
          fullWidth
          {...register('password', { required: true })}
          error={Boolean(errors.password)}
          helperText={errors.password && intl.get('PASSWORD_REQUIRED_ERROR')}
          data-testid="password"
        />
        <div>
          <Select
            defaultValue={networks[0].label}
            variant="outlined"
            fullWidth
            {...register('networkId', { required: true })}
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
    </Wrapper>
  )
}

export default Login
