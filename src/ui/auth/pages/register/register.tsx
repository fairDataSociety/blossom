import React, { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import intl from 'react-intl-universal'
import Title from '../../../common/components/title/title.component'
import { Button, CircularProgress, Typography } from '@mui/material'
import DoneAll from '@mui/icons-material/DoneAll'
import UsernamePassword from './username-password'
import MnemonicConfirmation from './mnemonic-confirmation'
import ErrorMessage from '../../../common/components/error-message/error-message.component'
import { RegisterData, RegisterDataMnemonic } from '../../../../model/internal-messages.model'
import { networks } from '../../../../constants/networks'
import { generateWallet, register } from '../../../../messaging/content-api.messaging'
import WaitingPayment from './waiting-payment'
import { Address, Mnemonic } from '../../../../model/general.types'
import MnemonicComponent from './mnemonic'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import Wrapper from '../components/wrapper'
import RegisterMethods from './register-methods'
import EnterMnemonic from './enter-mnemonic'
import { isSwarmExtensionError } from '../../../../utils/extension'

enum Steps {
  UsernamePassword,
  ChooseMethod,
  Mnemonic,
  MnemonicConfirmation,
  EnterMnemonic,
  WaitingPayment,
  Complete,
  Loading,
  Error,
}

const LoaderWrapperDiv = styled('div')({
  width: '100%',
  height: '20vh',
  display: 'flex',
})

interface RegistrationState extends RegisterDataMnemonic {
  address: Address
  mnemonic: Mnemonic
}

const emptyState: RegistrationState = {
  username: '',
  password: '',
  address: '',
  mnemonic: '',
  network: networks[0],
}

const Register = () => {
  const [step, setStep] = useState<Steps>(Steps.UsernamePassword)
  const [data, setData] = useState<RegistrationState>(emptyState)
  const [error, setError] = useState<string>(null)

  const onUsernamePasswordSubmit = (registerData: RegisterData) => {
    setData({
      ...data,
      ...registerData,
    })
    setStep(Steps.ChooseMethod)
  }

  const onNewAccountSelect = () => {
    setStep(Steps.Loading)
    getMnemonic()
  }

  const onExistingAccountSelect = () => {
    setStep(Steps.EnterMnemonic)
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

  const onMnemonicEntered = (mnemonic: string) => {
    setData({
      ...data,
      mnemonic,
    })
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
      const { username, password, mnemonic, network } = data

      setError(null)

      await register({
        username,
        password,
        mnemonic,
        network,
      })
      setStep(Steps.Complete)
    } catch (error) {
      console.error(error)

      if (isSwarmExtensionError(error.toString())) {
        setError(intl.get('SWARM_EXTENSION_ERROR'))
      }

      setStep(Steps.Error)
    }
  }

  const getStepInstructionMessage = (step: Steps): string => {
    let message: string = null

    if (step === Steps.UsernamePassword) {
      message = 'REGISTRATION_INSTRUCTIONS'
    } else if (step === Steps.ChooseMethod) {
      message = 'REGISTRATION_OPTIONS_DESCRIPTION'
    } else if (step === Steps.Mnemonic) {
      message = 'MNEMONIC_INSTRUCTIONS'
    } else if (step === Steps.MnemonicConfirmation) {
      message = 'MNEMONIC_CONFIRMATION_INSTRUCTIONS'
    } else if (step === Steps.EnterMnemonic) {
      message = 'EXISTING_ACCOUNT_INSTRUCTIONS'
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
    if (data.mnemonic && step === Steps.EnterMnemonic) {
      setStep(Steps.Loading)
      registerUser()
    }
  }, [data.mnemonic])

  useEffect(() => {
    if (step === Steps.UsernamePassword) {
      setData(emptyState)
    }
  }, [step])

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
      {step === Steps.ChooseMethod && (
        <RegisterMethods
          onNewAccountSelect={onNewAccountSelect}
          onExistingAccountSelect={onExistingAccountSelect}
        />
      )}
      {step === Steps.Mnemonic && <MnemonicComponent phrase={data.mnemonic} onConfirm={onMnemonicRead} />}
      {step === Steps.MnemonicConfirmation && (
        <MnemonicConfirmation phrase={data.mnemonic} onConfirm={onMnemonicConfirmed} />
      )}
      {step === Steps.EnterMnemonic && <EnterMnemonic onSubmit={onMnemonicEntered} />}
      {step === Steps.WaitingPayment && (
        <WaitingPayment address={data.address} onPaymentDetected={onPaymentConfirmed} onError={onError} />
      )}
      {step === Steps.Complete && (
        <FlexColumnDiv>
          <DoneAll sx={{ margin: 'auto' }} data-testid="complete" />
        </FlexColumnDiv>
      )}
      {step === Steps.Loading && (
        <LoaderWrapperDiv>
          <CircularProgress sx={{ margin: 'auto' }} />
        </LoaderWrapperDiv>
      )}
      {step === Steps.Error && (
        <LoaderWrapperDiv sx={{ flexDirection: 'column' }}>
          <ErrorMessage>{error || intl.get('REGISTRATION_ERROR')}</ErrorMessage>
          <Button onClick={reset} sx={{ marginTop: '20px' }}>
            {intl.get('TRY_AGAIN')}
          </Button>
        </LoaderWrapperDiv>
      )}
    </Wrapper>
  )
}

export default Register
