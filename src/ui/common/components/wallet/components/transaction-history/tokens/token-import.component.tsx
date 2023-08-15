import React, { useState } from 'react'
import intl from 'react-intl-universal'
import { Button, TextField, Typography } from '@mui/material'
import { checkTokenContract, importToken } from '../../../../../../../messaging/content-api.messaging'
import ErrorMessage from '../../../../error-message/error-message.component'
import { useWalletLock } from '../../../hooks/wallet-lock.hook'
import { useForm } from 'react-hook-form'
import Form from '../../../../form/form.component'
import { Address } from '../../../../../../../model/general.types'
import { addressRegex, isAddressValid } from '../../../../../utils/ethers'
import FieldSpinner from '../../../../field-spinner/field-spinner.component'
import { useWallet } from '../../../context/wallet.context'
import { useUser } from '../../../../../hooks/user.hooks'
import { Token } from '../../../../../../../model/storage/wallet.model'
import TokenInfo from './token-info.component'
import { useNavigate } from 'react-router-dom'

interface FormFields {
  address: Address
}

const TokenImport = () => {
  useWalletLock()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormFields>()
  const [token, setToken] = useState<Token | null>(null)
  const [importDone, setImportDone] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  const { walletNetwork } = useWallet()
  const navigate = useNavigate()

  const getRpcUrl = () => walletNetwork?.rpc || user.network.rpc

  const checkContract = async (address: Address) => {
    if (!isAddressValid(address)) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      setToken(null)
      const token = await checkTokenContract(address, getRpcUrl())

      setToken(token)
    } catch (error) {
      console.error(error)
      setError(String(error))
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      await importToken(token)
      setImportDone(true)
    } catch (error) {
      console.error(error)
      setError(String(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {importDone ? (
        <>
          <Typography variant="body1" sx={{ marginBottom: '10px' }}>
            {intl.get('IMPORT_TOKEN_SUCCESS')}:
          </Typography>
          <TokenInfo token={token} />
          <Button
            color="primary"
            variant="contained"
            sx={{
              marginTop: '20px',
            }}
            onClick={() => navigate('..')}
            data-testid="back-button"
          >
            {intl.get('BACK')}
          </Button>
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ marginBottom: '10px' }}>
            {intl.get('IMPORT_TOKEN_INSTRUCTIONS')}:
          </Typography>
          <TextField
            label={intl.get('ADDRESS')}
            placeholder="0x..."
            disabled={loading}
            {...register('address', {
              required: true,
              pattern: addressRegex,
              onChange: (event) => checkContract(event.target.value),
            })}
            error={Boolean(errors.address)}
            helperText={errors.address && intl.get('ADDRESS_ERROR')}
            data-testid="address-input"
          />
          {token && <TokenInfo token={token} />}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button
            color="primary"
            variant="contained"
            type="submit"
            size="large"
            disabled={loading || !token}
            data-testid="address-submit"
            sx={{
              marginTop: '50px',
            }}
          >
            {intl.get('IMPORT')}
            {loading && <FieldSpinner />}
          </Button>
        </>
      )}
    </Form>
  )
}

export default TokenImport