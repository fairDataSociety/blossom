import React, { useState } from 'react'
import intl from 'react-intl-universal'
import Title from '../../../common/components/title/title.component'
import Form from '../../../common/components/form/form.component'
import { useAccounts } from '../../../common/hooks/accounts.hooks'
import { useForm } from 'react-hook-form'
import { Button, MenuItem, Select, TextField } from '@mui/material'
import NoAccounts from './no-accounts'
import ErrorMessage from '../../../common/components/error-message/error-message.component'
import FieldSpinner from '../../../common/components/field-spinner/field-spinner.component'
import { localLogin } from '../../../../messaging/content-api.messaging'
import { useNetworks } from '../../../common/hooks/networks.hooks'

interface FormFields {
  name: string
  password: string
  networkLabel: string
}

const LocalLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [error, setError] = useState<string>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { accounts } = useAccounts()
  const { networks, selectedNetwork } = useNetworks()

  const onSubmit = async ({ name, password, networkLabel }: FormFields) => {
    setError(null)
    setLoading(true)

    try {
      await localLogin({
        name,
        password,
        network: networks.find((network) => network.label === networkLabel),
      })

      chrome.tabs.getCurrent((tab) => chrome.tabs.remove(tab.id))
    } catch (error) {
      console.error(error)

      if (typeof error === 'string') {
        if (error.includes('Incorrect password')) {
          return setError(intl.get('INVALID_PASSWORD'))
        }
      }

      setError(intl.get('GENERAL_ERROR_MESSAGE'))
    } finally {
      setLoading(false)
    }
  }

  const getDefaultNetwork = () => {
    const accountNetwork = accounts[0].network

    if (accountNetwork && networks.some(({ label }) => label === accountNetwork.label)) {
      return accountNetwork.label
    }

    return selectedNetwork.label
  }

  if (!accounts || !networks) {
    return null
  }

  if (accounts.length === 0) {
    return <NoAccounts />
  }

  return (
    <>
      <Title>{intl.get('LOCAL_LOGIN')}</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Select
            defaultValue={accounts[0].name}
            variant="outlined"
            fullWidth
            {...register('name', { required: true })}
          >
            {accounts.map(({ name }) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </div>
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
            defaultValue={getDefaultNetwork()}
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
    </>
  )
}

export default LocalLogin
