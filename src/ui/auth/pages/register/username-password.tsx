import React, { useState } from 'react'
import intl from 'react-intl-universal'
import { useForm } from 'react-hook-form'
import { Button, MenuItem, Select, TextField } from '@mui/material'
import Form from '../../../common/components/form/form.component'
import { networks } from '../../../../constants/networks'
import { RegisterData } from '../../../../model/internal-messages.model'
import { isUsernameAvailable } from '../../../../messaging/content-api.messaging'

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
  const [usernameTaken, setUsernameTaken] = useState<boolean>(false)

  const onSubmitInternal = async ({ username, password, networkId }: FormFields) => {
    try {
      const network = networks.find((network) => network.id === Number(networkId))

      const usernameAvailable = await isUsernameAvailable({ username, network })

      if (!usernameAvailable) {
        return setUsernameTaken(true)
      }

      onSubmit({
        username,
        password,
        privateKey: '',
        network: networks.find((network) => network.id === Number(networkId)),
      })
    } catch (error) {
      console.error(error)
    }
  }

  const getUsernameError = () => {
    if (errors.username) {
      return intl.get('USERNAME_REQUIRED_ERROR')
    }

    if (usernameTaken) {
      return intl.get('USERNAME_NOT_AVAILABLE')
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmitInternal)}>
      <TextField
        label={intl.get('USERNAME')}
        variant="outlined"
        fullWidth
        {...register('username', { required: true })}
        onChange={() => setUsernameTaken(false)}
        error={Boolean(errors.username || usernameTaken)}
        helperText={getUsernameError()}
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
