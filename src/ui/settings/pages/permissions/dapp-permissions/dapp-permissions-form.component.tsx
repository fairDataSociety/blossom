import React, { useState } from 'react'
import intl from 'react-intl-universal'
import { Button, Checkbox, FormControlLabel, Typography, useTheme } from '@mui/material'
import { Dapp, PodPermission } from '../../../../../model/storage/dapps.model'
import { FlexColumnDiv } from '../../../../common/components/utils/utils'
import PodPermissionsTable from './pod-permissions-table.component'
import FieldSpinner from '../../../../common/components/field-spinner/field-spinner.component'

export interface DappPermissionsFormProps {
  dapp: Dapp
  disabled: boolean
  onUpdate: (dapp: Dapp) => void
}

const DappPermissionsForm = ({ dapp, disabled, onUpdate }: DappPermissionsFormProps) => {
  const theme = useTheme()
  const [podPermissions, setPodPermissions] = useState<Record<string, PodPermission>>({
    ...dapp.podPermissions,
  })
  const [fullStorageAccess, setFullStorageAccess] = useState<boolean>(dapp.fullStorageAccess)
  const { dappId } = dapp

  const onPodPermissionDelete = (podName: string) => {
    const podPermissionsCopy = { ...podPermissions }

    delete podPermissionsCopy[podName]

    setPodPermissions(podPermissionsCopy)
  }

  const onSubmit = () => {
    onUpdate({
      ...dapp,
      fullStorageAccess,
      podPermissions,
    })
  }

  return (
    <FlexColumnDiv sx={{ marginTop: '20px' }}>
      <Typography variant="body1" align="center">
        {intl.get('DAPP_ID')}
      </Typography>
      <Typography variant="caption" sx={{ color: theme.palette.grey[500] }}>
        {dappId}
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            value={fullStorageAccess}
            defaultChecked={dapp.fullStorageAccess}
            onChange={() => setFullStorageAccess(!fullStorageAccess)}
          />
        }
        disabled={disabled}
        label={intl.get('PERSONAL_STORAGE_FULL_ACCESS')}
        sx={{ margin: '20px 0' }}
      />
      <PodPermissionsTable
        podPermissions={podPermissions}
        onDelete={onPodPermissionDelete}
        disabled={disabled}
      />
      <Button
        color="primary"
        variant="contained"
        type="submit"
        disabled={disabled}
        data-testid="submit"
        onClick={onSubmit}
        sx={{
          marginTop: '20px',
        }}
      >
        {intl.get('SAVE')}
        {disabled && <FieldSpinner />}
      </Button>
    </FlexColumnDiv>
  )
}

export default DappPermissionsForm
