import React, { useMemo } from 'react'
import intl from 'react-intl-universal'
import { Collapse, FormControlLabel, MenuItem, Select, Switch, Tooltip } from '@mui/material'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import { millisecondsToMinutes, minutesToMilliseconds } from '../../../../utils/converters'

export interface WalletLockInputProps {
  value?: number
  isLocked: boolean
  onChange: (value: number) => void
}

const INTERVAL_OPTIONS = [5, 10, 15, 30, 45, 60]

const WalletLockInput = ({ value, isLocked, onChange }: WalletLockInputProps) => {
  const minutes = useMemo(() => {
    const minutes = millisecondsToMinutes(value)

    return INTERVAL_OPTIONS.some((interval) => interval === minutes) ? minutes : INTERVAL_OPTIONS[0]
  }, [value])

  const onSwitchChange = (value: boolean) => {
    // TODO Password dialog should be shown if lock expired
    onChange(value ? minutesToMilliseconds(INTERVAL_OPTIONS[0]) : undefined)
  }

  const onValueChange = (minutes: string | number) => {
    onChange(minutesToMilliseconds(Number(minutes)))
  }

  const switchElement = (
    <FormControlLabel
      control={
        <Switch
          checked={Boolean(value)}
          disabled={isLocked}
          onChange={(event, value) => onSwitchChange(value)}
        />
      }
      label={intl.get('ENABLE_WALLET_LOCK')}
    />
  )

  return (
    <FlexColumnDiv sx={{ borderTop: '1px solid #ddd', padding: '5px 0', marginBottom: '10px' }}>
      {isLocked ? (
        <Tooltip title={intl.get('WALLET_SETTINGS_WARNING')}>{switchElement}</Tooltip>
      ) : (
        switchElement
      )}
      <Collapse in={Boolean(value)}>
        <Select
          value={minutes}
          variant="outlined"
          size="small"
          sx={{ margin: 'auto' }}
          disabled={isLocked}
          onChange={(event) => onValueChange(event.target.value)}
          data-testid="lock-interval-select"
        >
          {INTERVAL_OPTIONS.map((interval) => (
            <MenuItem key={interval} value={interval}>
              {interval} {intl.get('MINUTES')}
            </MenuItem>
          ))}
        </Select>
      </Collapse>
    </FlexColumnDiv>
  )
}

export default WalletLockInput
