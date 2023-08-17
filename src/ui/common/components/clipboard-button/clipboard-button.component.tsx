import React, { useState } from 'react'
import intl from 'react-intl-universal'
import { IconButton, Snackbar } from '@mui/material'
import ContentCopy from '@mui/icons-material/ContentCopy'

export interface ClipboardButtonProps {
  text: string
}

const ClipboardButton = ({ text }: ClipboardButtonProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const [closeTimeoutHandle, setCloseTimeoutHandle] = useState<NodeJS.Timeout>(null)

  const onClick = () => {
    navigator.clipboard.writeText(text)
    openSnackbar()
  }

  const openSnackbar = () => {
    if (closeTimeoutHandle) {
      clearTimeout(closeTimeoutHandle)
    }
    setOpen(true)
    setCloseTimeoutHandle(setTimeout(onClose, 3000))
  }

  const onClose = () => {
    if (closeTimeoutHandle) {
      clearTimeout(closeTimeoutHandle)
    }
    setOpen(false)
    setCloseTimeoutHandle(null)
  }

  return (
    <>
      <IconButton size="large" onClick={onClick} data-testid="copy-btn">
        <ContentCopy />
      </IconButton>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        onClose={onClose}
        message={intl.get('COPY_TO_CLIPBOARD_MESSAGE')}
      />
    </>
  )
}

export default ClipboardButton
