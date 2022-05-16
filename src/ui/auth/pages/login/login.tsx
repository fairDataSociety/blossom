import { styled } from '@mui/system'
import React, { useState } from 'react'
import intl from 'react-intl-universal'
import { useForm } from 'react-hook-form'
import { Button, MenuItem, Select, TextField } from '@mui/material'
import Title from '../../../common/components/title/title.component'
import Form from '../../../common/components/form/form.component'
import { Network, networks } from '../../../../constants/networks'
import ErrorMessage from '../../../common/components/error-message/error-message.component'
import FieldSpinner from '../../../common/components/field-spinner/field-spinner.component'
import { sendMessage } from '../../../../messaging/scripts.messaging'
import BackgroundAction from '../../../../constants/background-actions.enum'

const Wrapper = styled('div')(({ theme }) => ({
  marginTop: '50px',
  padding: '50px',
  borderRadius: '20px',
  border: `1px solid ${theme.palette.border.main}`,
}))

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setError(null)
    setLoading(true)

    try {
      await sendMessage<{ username: string; password: string; network: Network }, void>(
        BackgroundAction.LOGIN,
        data,
      )
    } catch (err) {
      if (err?.status === 500 && err?.json?.message?.includes('invalid password')) {
        return setError('Invalid password')
      }
      setError('Error')
    } finally {
      setLoading(false)
    }
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
        />
        <TextField
          label={intl.get('PASSWORD')}
          variant="outlined"
          type="password"
          fullWidth
          {...register('password', { required: true })}
          error={Boolean(errors.password)}
          helperText={errors.password && intl.get('PASSWORD_REQUIRED_ERROR')}
        />
        <div>
          <Select
            defaultValue={networks[0].id}
            variant="outlined"
            fullWidth
            {...register('network', { required: true })}
          >
            {networks.map(({ id, label }) => (
              <MenuItem key={id} value={id}>
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
