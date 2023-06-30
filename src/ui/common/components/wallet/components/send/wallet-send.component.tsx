import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import WalletImage from '@mui/icons-material/Wallet'
import { Address } from '../../../../../../model/general.types'
import { FlexColumnDiv } from '../../../utils/utils'
import Header from '../../../header/header.component'
import { useWallet } from '../../context/wallet.context'
import { sendTransaction } from '../../../../../../messaging/content-api.messaging'
import { utils } from 'ethers'
import { useUser } from '../../../../hooks/user.hooks'
import AddressSelect from './address-select.component'
import { getWalletContacts } from '../../../../../../listeners/message-listeners/account.listener'
import AmountSelect from './amount-select.component'
import TransactionConfirmation from './transaction-confirmation'
import TransactionCompleted from './transaction-completed'

enum STEPS {
  ADDRESS,
  VALUE,
  CONFIRMATION,
  COMPLETED,
}
const WalletSend = () => {
  const [value, setValue] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const { walletNetwork } = useWallet()
  const { user, error: userError } = useUser()

  const loadAddresses = async () => {
    const addresses = await getWalletContacts()

    setAddresses(addresses)
  }

  const getRpcUrl = () => walletNetwork?.rpc || user.network.rpc

  const getError = () => userError || error

  const onSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      await sendTransaction({
        to: address,
        rpcUrl: getRpcUrl(),
        value: utils.parseUnits(value, 'ether').toString(),
      })
      setCompleted(true)
    } catch (error) {
      console.error(error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  const getStep = () => {
    if (!address) {
      return STEPS.ADDRESS
    }

    if (!value) {
      return STEPS.VALUE
    }

    if (!completed) {
      return STEPS.CONFIRMATION
    }

    return STEPS.COMPLETED
  }

  const reset = () => {
    setValue('')
    setAddress('')
    setError('')
    setCompleted(false)
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  const step = getStep()

  return (
    <FlexColumnDiv>
      <Header title={intl.get('WALLET')} image={WalletImage} showOpenPage />

      {step === STEPS.ADDRESS && (
        <AddressSelect disabled={loading} addresses={addresses} onSubmit={setAddress} />
      )}
      {step === STEPS.VALUE && (
        <AmountSelect
          address={address}
          user={user}
          rpcUrl={getRpcUrl()}
          onSubmit={setValue}
          onCancel={() => setAddress('')}
        />
      )}
      {step === STEPS.CONFIRMATION && (
        <TransactionConfirmation
          address={address}
          value={utils.parseUnits(value, 'ether').toString()}
          rpcUrl={getRpcUrl()}
          user={user}
          loading={loading}
          error={getError()}
          onCancel={() => setValue('')}
          onSubmit={onSubmit}
        />
      )}
      {step === STEPS.COMPLETED && <TransactionCompleted onReset={reset} />}
    </FlexColumnDiv>
  )
}

export default WalletSend
