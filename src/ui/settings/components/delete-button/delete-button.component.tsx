import React from 'react'
import { ButtonProps, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'

const DeleteButton = (props: ButtonProps) => {
  return (
    <IconButton color="secondary" component="span" {...props}>
      <Delete />
    </IconButton>
  )
}

export default DeleteButton
