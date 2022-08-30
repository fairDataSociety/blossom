import React from 'react'
import intl from 'react-intl-universal'
import { Button, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import RouteCodes from '../../routes/route-codes'

const NoAccounts = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  return (
    <>
      <Typography
        variant="body1"
        align="center"
        sx={{
          marginTop: '20px',
        }}
      >
        {intl.get('NO_ACCOUNTS_WARNING')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{
          margin: 'auto',
          marginTop: '30px',
          backgroundColor: theme.palette.tertiary.main,
        }}
        onClick={() => navigate(RouteCodes.import)}
        data-testid="import"
      >
        {intl.get('IMPORT')}
      </Button>
    </>
  )
}

export default NoAccounts
