import React from 'react'
import { Typography } from '@mui/material'

export interface ErrorMessageProps {
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLSpanElement>
}

const ErrorMessage = ({ children, onClick }: ErrorMessageProps) => {
  return (
    <Typography
      variant="body1"
      align="center"
      data-testid="error-message"
      sx={{
        color: (theme) => theme.palette.error.main,
        marginTop: '20px',
        cursor: onClick ? 'pointer' : 'auto',
      }}
      onClick={onClick}
    >
      {children}
    </Typography>
  )
}

export default ErrorMessage
