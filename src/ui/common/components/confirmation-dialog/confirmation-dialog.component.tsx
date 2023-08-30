import React from 'react'
import intl from 'react-intl-universal'
import {
  DialogProps,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

export interface ConfirmationDialogProps {
  open: boolean
  dialogProps?: DialogProps
  title: string
  children: React.ReactNode
  onCancel: () => void
  onConfirm: () => void
}

const ConfirmationDialog = ({
  open,
  dialogProps,
  title,
  children,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} {...dialogProps}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{intl.get('CANCEL')}</Button>
        <Button onClick={onConfirm} autoFocus>
          {intl.get('CONFIRM')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
