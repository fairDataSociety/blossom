import React, { useState } from 'react'
import { styled } from '@mui/system'
import intl from 'react-intl-universal'
import Title from '../../../common/components/title/title.component'
import { CircularProgress, Typography } from '@mui/material'
import UsernamePassword from './username-password'
import BackgroundAction from '../../../../constants/background-actions.enum'
import { sendMessage } from '../../../../messaging/scripts.messaging'
import Mnemonic from './mnemonic'
import MnemonicConfirmation from './mnemonic-confirmation'
import ErrorMessage from '../../../common/components/error-message/error-message.component'

const Wrapper = styled('div')(({ theme }) => ({
  marginTop: '50px',
  padding: '50px',
  borderRadius: '20px',
  border: `1px solid ${theme.palette.border.main}`,
}))

enum Steps {
  UsernamePassword,
  Mnemonic,
  MnemonicConfirmation,
  Complete,
  Loading,
  Error,
}

interface RegistrationData {
  username: string
  password: string
  mnemonic: string
}

const LoaderWrapperDiv = styled('div')({
  width: '100%',
  height: '20vh',
  display: 'flex',
})

const Register = () => {
  const [step, setStep] = useState<Steps>(Steps.UsernamePassword)
  const [data, setData] = useState<RegistrationData>({})

  const onUsernamePasswordSubmit = (username: string, password: string) => {
    setData({
      ...data,
      username,
      password,
    })
    setStep(Steps.Loading)
    getMnemonic()
  }

  const onMnemonicRead = () => {
    setStep(Steps.MnemonicConfirmation)
  }

  const onMnemonicConfirmed = () => {
    setStep(Steps.Complete)
  }

  const getMnemonic = async () => {
    try {
      const mnemonic = await sendMessage<void, string>(BackgroundAction.GENERATE_MNEMONIC)
      setData({
        ...data,
        mnemonic,
      })
      setStep(Steps.Mnemonic)
    } catch (error) {
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
    } else if (step === Steps.Complete) {
      message = 'REGISTRATION_COMPLETE'
    }

    return message ? intl.get(message) : ''
  }

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
      {step === Steps.Mnemonic && <Mnemonic phrase={data.mnemonic} onConfirm={onMnemonicRead} />}
      {step === Steps.MnemonicConfirmation && (
        <MnemonicConfirmation phrase={data.mnemonic} onConfirm={onMnemonicConfirmed} />
      )}
      {step === Steps.Loading && (
        <LoaderWrapperDiv>
          <CircularProgress sx={{ margin: 'auto' }} />
        </LoaderWrapperDiv>
      )}
      {step === Steps.Error && (
        <LoaderWrapperDiv>
          <ErrorMessage>{intl.get('REGISTRATION_ERROR')}</ErrorMessage>
        </LoaderWrapperDiv>
      )}
    </Wrapper>
  )
}

export default Register
