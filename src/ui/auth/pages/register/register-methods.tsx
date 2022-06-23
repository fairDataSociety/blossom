import React from 'react'
import { styled } from '@mui/system'
import intl from 'react-intl-universal'
import { Button } from '@mui/material'
import { MarginLeftAuto } from '../../../common/components/utils/utils'

const Wrapper = styled('div')(({ theme }) => ({
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

interface RegisterMethodsProps {
  onNewAccountSelect: () => void
  onExistingAccountSelect: () => void
}

const RegisterMethods = ({ onNewAccountSelect, onExistingAccountSelect }: RegisterMethodsProps) => {
  return (
    <Wrapper>
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={buttonStyle}
        onClick={onNewAccountSelect}
        data-testid="register-new"
      >
        {intl.get('NEW_ACCOUNT')}
      </Button>
      <MarginLeftAuto>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={buttonStyle}
          onClick={onExistingAccountSelect}
          data-testid="existing-account"
        >
          {intl.get('EXISTING_ACCOUNT')}
        </Button>
      </MarginLeftAuto>
    </Wrapper>
  )
}

export default RegisterMethods
