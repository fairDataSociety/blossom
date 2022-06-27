import React from 'react'
import { Typography } from '@mui/material'

export interface ErrorMessageProps {
  children: React.ReactNode
}

const ErrorMessage = ({ children }: ErrorMessageProps) => {
  return (
    <Typography
      variant="body1"
      align="center"
      data-testid="error-message"
      sx={{
        color: (theme) => theme.palette.error.main,
        marginTop: '20px',
      }}
    >
      {children}
    </Typography>
  )
}

export default ErrorMessage
