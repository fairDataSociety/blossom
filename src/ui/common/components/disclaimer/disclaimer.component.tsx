import React from 'react'
import intl from 'react-intl-universal'
import { styled } from '@mui/system'
import { Typography } from '@mui/material'

const Box = styled('div')(({ theme }) => ({
  padding: '10px',
  margin: '10px',
  border: `2px solid ${theme.palette.primary.main}`,
}))

const Disclaimer = () => {
  return (
    <Box>
      <Typography>{intl.get('DISCLAIMER')}</Typography>
    </Box>
  )
}

export default Disclaimer
