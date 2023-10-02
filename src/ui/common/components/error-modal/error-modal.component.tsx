import React from 'react'
import intl from 'react-intl-universal'
import { IconButton, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Close from '@mui/icons-material/Close'

export interface ErrorModalProps {
  open: boolean
  onClose: () => void
  error: string
}

const ErrorModal = ({ open, onClose, error }: ErrorModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(90%, 400px)',
        backgroundColor: '#fff !important',
        boxShadow: 24,
        p: 4,
      }}
      components={{
        Backdrop: null,
      }}
    >
      <Box sx={{ height: '80%' }}>
        <Typography variant="h6" component="h2">
          {intl.get('ERROR_DESCRIPTION')}
        </Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 5, right: 5 }}>
          <Close />
        </IconButton>
        <Typography color="error" sx={{ mt: 2, height: '100%', overflow: 'auto' }}>
          {error}
        </Typography>
      </Box>
    </Modal>
  )
}

export default ErrorModal
