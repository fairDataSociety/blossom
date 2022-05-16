import React from 'react'
import intl from 'react-intl-universal'
import { useForm } from 'react-hook-form'
import { Button, TextField } from '@mui/material'
import Form from '../../../common/components/form/form.component'

export interface UsernamePasswordProps {
  onSubmit: (username: string, password: string) => void
}

interface FormFields {
  username: string
  password: string
}

const UsernamePassword = ({ onSubmit }: UsernamePasswordProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const onSubmitInternal = ({ username, password }: FormFields) => {
    onSubmit(username, password)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmitInternal)}>
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
      <Button
        color="primary"
        variant="contained"
        type="submit"
        size="large"
        sx={{
          marginTop: '50px',
        }}
      >
        {intl.get('REGISTER')}
      </Button>
    </Form>
  )
}

export default UsernamePassword
