import React from 'react'
import { styled } from '@mui/system'
import intl from 'react-intl-universal'
import { useNavigate } from 'react-router-dom'
import Title from '../../../common/components/title/title.component'
import { Button, Typography } from '@mui/material'
import { MarginLeftAuto } from '../../../common/components/utils/utils'
import RouteCodes from '../../routes/route-codes'

const Wrapper = styled('div')(() => ({
  marginTop: '20px',
  padding: '50px',
}))

const Footer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
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
}

const Welcome = () => {
  const navigate = useNavigate()

  return (
    <Wrapper>
      <Title>{intl.get('WELCOME_TITLE')}</Title>
      <Typography variant="subtitle1" marginTop={2}>
        {intl.get('WELCOME_TEXT')}
      </Typography>
      <Footer>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={buttonStyle}
          onClick={() => navigate(RouteCodes.register)}
        >
          {intl.get('REGISTER')}
        </Button>
        <MarginLeftAuto>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={buttonStyle}
            onClick={() => navigate(RouteCodes.login)}
          >
            {intl.get('LOGIN')}
          </Button>
        </MarginLeftAuto>
      </Footer>
    </Wrapper>
  )
}

export default Welcome
