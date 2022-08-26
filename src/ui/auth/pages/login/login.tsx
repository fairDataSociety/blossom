import React, { useState } from 'react'
import intl from 'react-intl-universal'
import { useForm } from 'react-hook-form'
import { Button, Checkbox, FormControlLabel, MenuItem, Select, TextField } from '@mui/material'
import Title from '../../../common/components/title/title.component'
import Form from '../../../common/components/form/form.component'
import ErrorMessage from '../../../common/components/error-message/error-message.component'
import FieldSpinner from '../../../common/components/field-spinner/field-spinner.component'
import { localLogin, login } from '../../../../messaging/content-api.messaging'
import Wrapper from '../components/wrapper'
import { useNetworks } from '../../../common/hooks/networks.hooks'
import { isSwarmExtensionError } from '../../../../utils/extension'
import HelpTooltip from '../../../common/components/help-tooltip/help-tooltip.component'

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
  const { networks, selectedNetwork } = useNetworks()
  const [isLocalLogin, isIsLocalLogin] = useState<boolean>(false)
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false)

  const onSubmit = async ({ username, password, networkLabel }: FormFields) => {
    setError(null)
    setLoading(true)

    try {
      const selectedNetwork = networks.find((network) => network.label === networkLabel)

      if (isLocalLogin) {
        await localLogin({
          username,
          mnemonic: password,
          network: selectedNetwork,
        })
      } else {
        await login({
          username,
          password,
          network: selectedNetwork,
        })
      }

      chrome.tabs.getCurrent((tab) => chrome.tabs.remove(tab.id))
    } catch (error) {
      console.error(error)

      if (typeof error === 'string') {
        if (error.includes('Incorrect password')) {
          return setError(intl.get('INVALID_PASSWORD'))
        }

        if (error.includes('does not exists')) {
          return setError(intl.get('INVALID_USERNAME'))
        }

        if (isSwarmExtensionError(error)) {
          return setError(intl.get('SWARM_EXTENSION_ERROR'))
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
          label={intl.get('USERNAME') + (isLocalLogin ? ` (${intl.get('OPTIONAL')})` : '')}
          variant="outlined"
          fullWidth
          {...register('username', { required: !isLocalLogin })}
          error={Boolean(errors.username)}
          helperText={errors.username && intl.get('USERNAME_REQUIRED_ERROR')}
          data-testid="username"
        />
        <div>
          <FormControlLabel
            control={<Checkbox value={isLocalLogin} onChange={() => isIsLocalLogin(!isLocalLogin)} />}
            label={intl.get('LOCAL_LOGIN_LABEL')}
          />
          <HelpTooltip text={intl.get('LOCAL_LOGIN_DESCRIPTION')} />
        </div>
        <TextField
          label={intl.get(isLocalLogin ? 'RECOVERY_PHRASE' : 'PASSWORD')}
          variant="outlined"
          type={isLocalLogin && showMnemonic ? 'text' : 'password'}
          fullWidth
          {...register('password', { required: true })}
          error={Boolean(errors.password)}
          helperText={
            errors.password && intl.get(isLocalLogin ? 'MNEMONIC_REQUIRED' : 'PASSWORD_REQUIRED_ERROR')
          }
          data-testid="password"
        />
        {isLocalLogin && (
          <div>
            <FormControlLabel
              control={<Checkbox value={showMnemonic} onChange={() => setShowMnemonic(!showMnemonic)} />}
              label={intl.get('SHOW_RECOVERY_PHRASE')}
              sx={{ marginBottom: '20px' }}
            />
          </div>
        )}
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
