import React from 'react'
import intl from 'react-intl-universal'
import { useForm } from 'react-hook-form'
import { Button, MenuItem, Select, TextField } from '@mui/material'
import Form from '../../../common/components/form/form.component'
import { networks } from '../../../../constants/networks'
import { RegisterData } from '../../../../model/internal-messages.model'

export interface UsernamePasswordProps {
  onSubmit: (data: RegisterData) => void
}

interface FormFields {
  username: string
  password: string
  networkId: string
}

const UsernamePassword = ({ onSubmit }: UsernamePasswordProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const onSubmitInternal = ({ username, password, networkId }: FormFields) => {
    onSubmit({
      username,
      password,
      privateKey: '',
      network: networks.find((network) => network.id === Number(networkId)),
    })
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
      <div>
        <Select
          defaultValue={networks[0].id}
          variant="outlined"
          fullWidth
          {...register('networkId', { required: true })}
        >
          {networks.map(({ id, label }) => (
            <MenuItem key={id} value={id}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </div>
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
