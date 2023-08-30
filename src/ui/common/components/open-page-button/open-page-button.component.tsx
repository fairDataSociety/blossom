import React from 'react'
import intl from 'react-intl-universal'
import { IconButton, Tooltip } from '@mui/material'
import Fullscreen from '@mui/icons-material/Fullscreen'
import { useEnvironment } from '../../context/environment.context'

export interface OpenPageButtonProps {
  text: string
}

const OpenPageButton = () => {
  const { pageEnvironment } = useEnvironment()

  const onClick = () => {
    chrome.tabs.create({
      url: window.location.href,
    })
  }

  if (pageEnvironment === 'tab') {
    return null
  }

  return (
    <Tooltip title={intl.get('OPEN_PAGE_BUTTON_TITLE')}>
      <IconButton aria-label="open-page" size="large" onClick={onClick}>
        <Fullscreen />
      </IconButton>
    </Tooltip>
  )
}

export default OpenPageButton
