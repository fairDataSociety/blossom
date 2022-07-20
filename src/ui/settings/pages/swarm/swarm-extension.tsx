import React, { useState } from 'react'
import intl from 'react-intl-universal'
import { useForm } from 'react-hook-form'
import Form from '../../components/form/form.component'
import { TextField } from '@mui/material'
import SaveButton from '../../components/save-button/save-button.component'
import ErrorMessage from '../../../common/components/error-message/error-message.component'

export interface SwarmExtensionProps {
  extensionId?: string
  onUpdate: (extensionId: string) => Promise<void>
}

interface FormFields {
  extensionId: string
}

const SwarmExtension = ({ extensionId, onUpdate }: SwarmExtensionProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: { extensionId },
  })
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit = async ({ extensionId }: FormFields) => {
    try {
      setLoading(true)
      setError(false)
      await onUpdate(extensionId)
    } catch (error) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label={intl.get('SWARM_EXTENSION_ID')}
        variant="standard"
        fullWidth
        {...register('extensionId', { required: true })}
        error={Boolean(errors.extensionId)}
        helperText={errors.extensionId && intl.get('FIELD_REQUIRED')}
        data-testid="swarm-extension-id-input"
        sx={{ marginBottom: '20px' }}
      />
      {error && <ErrorMessage>{intl.get('GENERAL_ERROR_MESSAGE')}</ErrorMessage>}
      <SaveButton disabled={loading} data-testid="swarm-extension-id-submit" />
    </Form>
  )
}

export default SwarmExtension
