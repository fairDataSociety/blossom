import React from 'react'
import Help from '@mui/icons-material/Help'
import { IconButton, Tooltip } from '@mui/material'

export interface HelpTooltipProps {
  text: string
}

const HelpTooltip = ({ text }: HelpTooltipProps) => {
  return (
    <Tooltip title={text}>
      <IconButton>
        <Help />
      </IconButton>
    </Tooltip>
  )
}

export default HelpTooltip
