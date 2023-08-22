import React, { useEffect, useMemo, useState } from 'react'
import intl from 'react-intl-universal'
import WalletImage from '@mui/icons-material/Wallet'
import { Address } from '../../../../../../model/general.types'
import { FlexColumnDiv } from '../../../utils/utils'
import Header from '../../../header/header.component'
import { useWallet } from '../../context/wallet.context'
import { sendTransaction, transferTokens } from '../../../../../../messaging/content-api.messaging'
import { useUser } from '../../../../hooks/user.hooks'
import AddressSelect from './address-select.component'
import { getWalletContacts } from '../../../../../../listeners/message-listeners/account.listener'
import AmountSelect from './amount-select.component'
import TransactionConfirmation from './transaction-confirmation'
import TransactionCompleted from './transaction-completed'
import { useWalletLock } from '../../hooks/wallet-lock.hook'
import { convertFromDecimal } from '../../../../utils/ethers'
import { providers } from 'ethers'
import { useNetworks } from '../../../../hooks/networks.hooks'

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
  const [transaction, setTransaction] = useState<providers.TransactionReceipt | null>(null)
  const { walletNetwork, selectedToken } = useWallet()
  const { user, error: userError } = useUser()
  const { networks } = useNetworks()
  useWalletLock()

  const loadAddresses = async () => {
    const addresses = await getWalletContacts()

    setAddresses(addresses)
  }

  const getRpcUrl = () => walletNetwork?.rpc || user.network.rpc

  const blockExplorerUrl: string = useMemo(() => {
    if (!user) {
      return ''
    }

    const currentNetwork = (networks || []).find(({ rpc }) => rpc === getRpcUrl())

    return currentNetwork?.blockExplorerUrl
  }, [networks, walletNetwork, user])

  const getError = () => userError || error

  const onSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      let transaction: providers.TransactionReceipt

      if (selectedToken) {
        transaction = await transferTokens({
          token: selectedToken,
          to: address,
          value: convertFromDecimal(value, selectedToken.decimals).toString(),
          rpcUrl: getRpcUrl(),
        })
      } else {
        transaction = await sendTransaction({
          to: address,
          rpcUrl: getRpcUrl(),
          value: convertFromDecimal(value).toString(),
        })
      }

      setTransaction(transaction)
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

    if (!transaction) {
      return STEPS.CONFIRMATION
    }

    return STEPS.COMPLETED
  }

  const reset = () => {
    setValue('')
    setAddress('')
    setError('')
    setTransaction(null)
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  const step = getStep()

  return (
    <FlexColumnDiv>
      <Header title={intl.get('WALLET')} image={WalletImage} showOpenPage />

      {step === STEPS.ADDRESS && (
        <AddressSelect disabled={loading} addresses={addresses} token={selectedToken} onSubmit={setAddress} />
      )}
      {step === STEPS.VALUE && (
        <AmountSelect
          address={address}
          user={user}
          rpcUrl={getRpcUrl()}
          selectedToken={selectedToken}
          onSubmit={setValue}
          onCancel={() => setAddress('')}
        />
      )}
      {step === STEPS.CONFIRMATION && (
        <TransactionConfirmation
          address={address}
          value={convertFromDecimal(value).toString()}
          rpcUrl={getRpcUrl()}
          selectedToken={selectedToken}
          user={user}
          loading={loading}
          error={getError()}
          onCancel={() => setValue('')}
          onSubmit={onSubmit}
        />
      )}
      {step === STEPS.COMPLETED && (
        <TransactionCompleted
          onReset={reset}
          value={value}
          token={selectedToken}
          transaction={transaction}
          blockExplorerUrl={blockExplorerUrl}
        />
      )}
    </FlexColumnDiv>
  )
}

export default WalletSend
