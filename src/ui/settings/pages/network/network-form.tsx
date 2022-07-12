import React, { useState } from 'react'
import intl from 'react-intl-universal'
import { styled } from '@mui/system'
import { useForm } from 'react-hook-form'
import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import SaveButton from '../../components/save-button/save-button.component'
import { Network } from '../../../../model/storage/network.model'
import { EthAddressRegex } from '../../../../utils/asserts'
import ErrorMessage from '../../../common/components/error-message/error-message.component'
import DeleteButton from '../../components/delete-button/delete-button.component'
import { FlexDiv } from '../../../common/components/utils/utils'

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '20px',
})

const FIELD_MARGIN = '20px'

export interface NetworkFormProps {
  network: Network
  disabled: boolean
  canDelete: boolean
  onChange: (network: Network) => Promise<void>
  onDelete?: () => Promise<void>
}

interface FormFields {
  label: string
  rpc: string
  ensRegistry: string
  subdomainRegistrar: string
  publicResolver: string
}

const NetworkForm = ({ network, disabled, canDelete, onChange, onDelete }: NetworkFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      label: String(network.label),
      rpc: network.rpc,
      ensRegistry: network.ensRegistry as unknown as string,
      subdomainRegistrar: network.subdomainRegistrar as unknown as string,
      publicResolver: network.publicResolver as unknown as string,
    },
  })
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [contractsEnabled, setContractsEnabled] = useState<boolean>(false)

  const onSubmit = async (fields: FormFields) => {
    try {
      setLoading(true)
      setError(false)
      await onChange({
        ...fields,
        ensRegistry: fields.ensRegistry || undefined,
        subdomainRegistrar: fields.subdomainRegistrar || undefined,
        publicResolver: fields.publicResolver || undefined,
        custom: true,
      } as unknown as Network)
    } catch (error) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const onDeleteInternal = async () => {
    try {
      setLoading(true)
      await onDelete()
    } catch (error) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label={intl.get('NETWORK_NAME')}
        variant="standard"
        fullWidth
        {...register('label', { required: true })}
        error={Boolean(errors.label)}
        helperText={errors.label && intl.get('FIELD_REQUIRED')}
        data-testid="label"
        disabled={disabled}
        sx={{ marginBottom: FIELD_MARGIN }}
      />
      <TextField
        label={intl.get('RPC_ADDRESS')}
        variant="standard"
        fullWidth
        {...register('rpc', { required: true })}
        error={Boolean(errors.rpc)}
        helperText={errors.rpc && intl.get('FIELD_REQUIRED')}
        data-testid="rpc"
        disabled={disabled}
        sx={{ marginBottom: FIELD_MARGIN }}
      />
      <FormControlLabel
        control={
          <Checkbox
            value={contractsEnabled}
            onChange={() => setContractsEnabled(!contractsEnabled)}
            disabled={disabled}
          />
        }
        label={intl.get('CONTRACT_ADDRESSES')}
      />
      {contractsEnabled && (
        <>
          <TextField
            label={intl.get('ENS_REGISTRY_ADDRESS')}
            variant="standard"
            fullWidth
            {...register('ensRegistry', { required: true, pattern: EthAddressRegex })}
            error={Boolean(errors.ensRegistry)}
            helperText={errors.ensRegistry && intl.get('ADDRESS_NOT_VALID')}
            data-testid="ensRegistry"
            disabled={disabled}
            sx={{ marginBottom: FIELD_MARGIN }}
          />
          <TextField
            label={intl.get('SUBDOMAIN_REGISTRAR_ADDRESS')}
            variant="standard"
            fullWidth
            {...register('subdomainRegistrar', { required: true, pattern: EthAddressRegex })}
            error={Boolean(errors.subdomainRegistrar)}
            helperText={errors.subdomainRegistrar && intl.get('ADDRESS_NOT_VALID')}
            data-testid="subdomainRegistrar"
            disabled={disabled}
            sx={{ marginBottom: FIELD_MARGIN }}
          />
          <TextField
            label={intl.get('PUBLIC_RESOLVER_ADDRESS')}
            variant="standard"
            fullWidth
            {...register('publicResolver', { required: true, pattern: EthAddressRegex })}
            error={Boolean(errors.publicResolver)}
            helperText={errors.publicResolver && intl.get('ADDRESS_NOT_VALID')}
            data-testid="publicResolver"
            disabled={disabled}
            sx={{ marginBottom: FIELD_MARGIN }}
          />
        </>
      )}
      {error && <ErrorMessage>{intl.get('GENERAL_ERROR_MESSAGE')}</ErrorMessage>}
      <FlexDiv sx={{ marginTop: '20px' }}>
        <SaveButton disabled={loading || disabled} sx={{ flexGrow: 7 }} />
        {canDelete && <DeleteButton sx={{ flexGrow: 1 }} onClick={onDeleteInternal} disabled={disabled} />}
      </FlexDiv>
    </Form>
  )
}

export default NetworkForm
