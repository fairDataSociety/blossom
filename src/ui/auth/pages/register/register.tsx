import React, { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import intl from 'react-intl-universal'
import Title from '../../../common/components/title/title.component'
import { Button, CircularProgress, Typography } from '@mui/material'
import UsernamePassword from './username-password'
import MnemonicConfirmation from './mnemonic-confirmation'
import ErrorMessage from '../../../common/components/error-message/error-message.component'
import { RegisterData } from '../../../../model/internal-messages.model'
import { networks } from '../../../../constants/networks'
import { generateWallet, register } from '../../../../messaging/content-api.messaging'
import WaitingPayment from './waiting-payment'
import { Account, Mnemonic } from '../../../../model/general.types'
import MnemonicComponent from './mnemonic'

enum Steps {
  UsernamePassword,
  Mnemonic,
  MnemonicConfirmation,
  WaitingPayment,
  Complete,
  Loading,
  Error,
}

const Wrapper = styled('div')(({ theme }) => ({
  marginTop: '50px',
  padding: '50px',
  borderRadius: '20px',
  border: `1px solid ${theme.palette.border.main}`,
}))

const LoaderWrapperDiv = styled('div')({
  width: '100%',
  height: '20vh',
  display: 'flex',
})

interface RegistrationState extends RegisterData {
  account: Account
  mnemonic: Mnemonic
}

const emptyState: RegistrationState = {
  username: '',
  password: '',
  privateKey: '',
  account: '',
  mnemonic: '',
  network: networks[0],
}

const Register = () => {
  const [step, setStep] = useState<Steps>(Steps.UsernamePassword)
  const [data, setData] = useState<RegistrationState>(emptyState)

  const onUsernamePasswordSubmit = (registerData: RegisterData) => {
    setData({
      ...data,
      ...registerData,
    })
    setStep(Steps.Loading)
  }

  const getMnemonic = async () => {
    try {
      const response = await generateWallet()
      setData({
        ...data,
        ...response,
      })
      setStep(Steps.Mnemonic)
    } catch (error) {
      console.error(error)
      setStep(Steps.Error)
    }
  }

  const onMnemonicRead = () => {
    setStep(Steps.MnemonicConfirmation)
  }

  const onMnemonicConfirmed = () => {
    setStep(Steps.WaitingPayment)
  }

  const onPaymentConfirmed = () => {
    setStep(Steps.Loading)
    registerUser()
  }

  const onError = () => {
    setStep(Steps.Error)
  }

  const registerUser = async () => {
    try {
      const { username, password, privateKey, network } = data

      await register({
        username,
        password,
        privateKey,
        network,
      })
      setStep(Steps.Complete)
    } catch (error) {
      console.error(error)
      setStep(Steps.Error)
    }
  }

  const getStepInstructionMessage = (step: Steps): string => {
    let message: string = null

    if (step === Steps.UsernamePassword) {
      message = 'REGISTRATION_INSTRUCTIONS'
    } else if (step === Steps.Mnemonic) {
      message = 'MNEMONIC_INSTRUCTIONS'
    } else if (step === Steps.MnemonicConfirmation) {
      message = 'MNEMONIC_CONFIRMATION_INSTRUCTIONS'
    } else if (step === Steps.WaitingPayment) {
      message = 'WAITING_FOR_PAYMENT_INSTRUCTIONS'
    } else if (step === Steps.Complete) {
      message = 'REGISTRATION_COMPLETE'
    }

    return message ? intl.get(message) : ''
  }

  const reset = () => {
    setData(emptyState)
    setStep(Steps.UsernamePassword)
  }

  useEffect(() => {
    if (data.username) {
      getMnemonic()
    }
  }, [data.username])

  return (
    <Wrapper>
      <Title>{intl.get('REGISTER_TITLE')}</Title>
      <Typography
        variant="body1"
        align="center"
        sx={{
          marginTop: '20px',
        }}
      >
        {getStepInstructionMessage(step)}
      </Typography>
      {step === Steps.UsernamePassword && <UsernamePassword onSubmit={onUsernamePasswordSubmit} />}
      {step === Steps.Mnemonic && <MnemonicComponent phrase={data.mnemonic} onConfirm={onMnemonicRead} />}
      {step === Steps.MnemonicConfirmation && (
        <MnemonicConfirmation phrase={data.mnemonic} onConfirm={onMnemonicConfirmed} />
      )}
      {step === Steps.WaitingPayment && (
        <WaitingPayment account={data.account} onPaymentDetected={onPaymentConfirmed} onError={onError} />
      )}
      {step === Steps.Loading && (
        <LoaderWrapperDiv>
          <CircularProgress sx={{ margin: 'auto' }} />
        </LoaderWrapperDiv>
      )}
      {step === Steps.Error && (
        <LoaderWrapperDiv sx={{ flexDirection: 'column' }}>
          <ErrorMessage>{intl.get('REGISTRATION_ERROR')}</ErrorMessage>
          <Button onClick={reset} sx={{ marginTop: '20px' }}>
            {intl.get('TRY_AGAIN')}
          </Button>
        </LoaderWrapperDiv>
      )}
    </Wrapper>
  )
}

export default Register
