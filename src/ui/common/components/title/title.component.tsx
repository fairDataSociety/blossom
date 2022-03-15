import React from 'react'
import { Typography } from '@mui/material'

export interface TitleProps {
  children: React.ReactNode
}

const Title = ({ children }: TitleProps) => {
  return (
    <Typography variant="h4" align="center">
      {children}
    </Typography>
  )
}

export default Title
