import { styled } from '@mui/system'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, MenuItem, Select, TextField } from '@mui/material'
import CenteredWrapper from '../../../common/components/centered-wrapper/centered-wrapper.component'
import Title from '../../../common/components/title/title.component'
import Form from '../../../common/components/form/form.component'
import gateways from '../../../../constants/gateways.json'
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
      await sendMessage<{ username: string; password: string; gateway: string }, void>(
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
    <CenteredWrapper>
      <Wrapper>
        <Title>Fairdrive Login</Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            {...register('username', { required: true })}
            error={Boolean(errors.username)}
            helperText={errors.username && 'Please enter username'}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            {...register('password', { required: true })}
            error={Boolean(errors.password)}
            helperText={errors.password && 'Please enter password'}
          />
          <div>
            <Select
              defaultValue={gateways[0].value}
              variant="outlined"
              fullWidth
              {...register('gateway', { required: true })}
            >
              {gateways.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
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
            Login
            {loading && <FieldSpinner />}
          </Button>
        </Form>
      </Wrapper>
    </CenteredWrapper>
  )
}

export default Login
