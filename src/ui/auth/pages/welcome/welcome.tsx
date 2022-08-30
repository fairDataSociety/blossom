import React from 'react'
import { styled } from '@mui/system'
import intl from 'react-intl-universal'
import { useNavigate } from 'react-router-dom'
import Title from '../../../common/components/title/title.component'
import { Button, Typography, useTheme } from '@mui/material'
import RouteCodes from '../../routes/route-codes'

const Wrapper = styled('div')(() => ({
  marginTop: '20px',
  padding: '50px',
}))

const Footer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  margin: '50px 50px 0 50px',
  [theme.breakpoints.down('md')]: {
    margin: '50px 0 0 0',
  },
}))

const buttonStyle = {
  padding: '14px 0',
  width: '200px',
  fontSize: '16px',
  fontWeight: 'bold',
  marginRight: '30px',
  marginBottom: '20px',
}

const Welcome = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  return (
    <Wrapper>
      <Title>{intl.get('WELCOME_TITLE')}</Title>
      <Typography variant="subtitle1" marginTop={2}>
        {intl.get('WELCOME_TEXT')}
      </Typography>
      <Footer>
        <Button
          variant="contained"
          size="large"
          sx={buttonStyle}
          onClick={() => navigate(RouteCodes.register)}
          data-testid="register"
        >
          {intl.get('REGISTER')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            ...buttonStyle,
            backgroundColor: theme.palette.tertiary.main,
          }}
          onClick={() => navigate(RouteCodes.import)}
          data-testid="import"
        >
          {intl.get('IMPORT')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={buttonStyle}
          onClick={() => navigate(RouteCodes.login)}
          data-testid="login"
        >
          {intl.get('LOGIN')}
        </Button>
      </Footer>
    </Wrapper>
  )
}

export default Welcome
