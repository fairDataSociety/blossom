import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import Hive from '@mui/icons-material/Hive'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import Header from '../../../common/components/header/header.component'
import { Swarm } from '../../../../model/storage/swarm.model'
import { getSwarmSettings } from '../../../../messaging/content-api.messaging'
import { setSwarmSettings } from '../../../../listeners/message-listeners/settings.listener'
import { useNavigate } from 'react-router-dom'
import RouteCodes from '../../routes/route-codes'
import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import Form from '../../components/form/form.component'
import ErrorMessage from '../../../common/components/error-message/error-message.component'
import SaveButton from '../../components/save-button/save-button.component'

const SwarmComponent = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Swarm>({
    defaultValues: {},
  })

  const navigate = useNavigate()
  const [defaultSwarm, setDefaultSwarm] = useState<Swarm>(null)
  const [swarm, setSwarm] = useState<Swarm>(null)
  const [extensionEnabled, setExtensionEnabled] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchSwarmSettings = async () => {
    const swarm = await getSwarmSettings()
    setDefaultSwarm(swarm)
    setSwarm(swarm)
    setExtensionEnabled(Boolean(swarm.extensionEnabled))
    setValue('swarmUrl', swarm.swarmUrl)
    setValue('extensionId', swarm.extensionId)
    setValue('extensionEnabled', Boolean(swarm.extensionEnabled))
  }

  const onSubmit = async (swarm: Swarm) => {
    try {
      setLoading(true)
      setError(false)

      if (swarm.extensionEnabled) {
        swarm.swarmUrl = defaultSwarm.swarmUrl
      } else {
        swarm.extensionId = defaultSwarm.extensionId
      }

      await setSwarmSettings(swarm)

      navigate('..')
    } catch (error) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSwarmSettings()
  }, [])

  if (!swarm) {
    return null
  }

  return (
    <FlexColumnDiv>
      <Header title={intl.get('SWARM')} image={Hive} backRoute={RouteCodes.settings} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label={intl.get('BEE_URL')}
          variant="standard"
          fullWidth
          disabled={extensionEnabled}
          {...register('swarmUrl', { required: !extensionEnabled })}
          sx={{ marginTop: '20px', marginBottom: '30px' }}
          error={Boolean(errors.swarmUrl)}
          helperText={errors.swarmUrl && intl.get('FIELD_REQUIRED')}
          data-testid="bee-url-input"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={extensionEnabled}
              {...register('extensionEnabled', {
                onChange: () => setExtensionEnabled(!extensionEnabled),
              })}
            />
          }
          label={intl.get('USE_SWARM_EXTENSION')}
          sx={{ marginBottom: '20px' }}
        />
        {extensionEnabled && (
          <TextField
            label={intl.get('SWARM_EXTENSION_ID')}
            variant="standard"
            fullWidth
            {...register('extensionId', { required: extensionEnabled })}
            error={Boolean(errors.extensionId)}
            helperText={errors.extensionId && intl.get('FIELD_REQUIRED')}
            data-testid="swarm-extension-id-input"
            sx={{ marginBottom: '20px' }}
          />
        )}
        {error && <ErrorMessage>{intl.get('GENERAL_ERROR_MESSAGE')}</ErrorMessage>}
        <SaveButton disabled={loading} data-testid="swarm-extension-id-submit" />
      </Form>
    </FlexColumnDiv>
  )
}

export default SwarmComponent
