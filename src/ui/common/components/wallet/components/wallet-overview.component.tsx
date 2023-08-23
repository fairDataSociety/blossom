import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import { BigNumber } from 'ethers'
import Send from '@mui/icons-material/Send'
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew'
import { FlexColumnDiv, FlexDiv } from '../../utils/utils'
import { getAccountBalance, getTokenBalance } from '../../../../../messaging/content-api.messaging'
import { UserResponse } from '../../../../../model/internal-messages.model'
import { Button, CircularProgress, Divider, IconButton, MenuItem, Select, Typography } from '@mui/material'
import { Network } from '../../../../../model/storage/network.model'
import { useNetworks } from '../../../hooks/networks.hooks'
import { displayAddress, displayBalance } from '../../../utils/ethers'
import ClipboardButton from '../../clipboard-button/clipboard-button.component'
import { useNavigate } from 'react-router-dom'
import WalletRouteCodes from '../routes/wallet-route-codes'
import { useWallet } from '../context/wallet.context'
import ErrorMessage from '../../error-message/error-message.component'
import TransactionHistory from './transaction-history/transaction-history.component'
import { Token } from '../../../../../model/storage/wallet.model'
import ErrorModal from '../../error-modal/error-modal.component'
import { useUser } from '../../../hooks/user.hooks'
import { useWalletLock } from '../hooks/wallet-lock.hook'

interface WalletOverviewProps {
  user: UserResponse
  onLock: () => void
}

const WalletOverview = ({ user: { address, network }, onLock }: WalletOverviewProps) => {
  const { walletNetwork, setWalletNetwork, selectedToken, setSelectedToken } = useWallet()
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(walletNetwork || network)
  const [balance, setBalance] = useState<BigNumber | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false)
  const { networks } = useNetworks()
  const { user } = useUser()
  const navigate = useNavigate()
  const { checkLockError } = useWalletLock()

  const loadData = async (network: Network, token: Token) => {
    try {
      setBalance(null)

      const balance = await (token
        ? getTokenBalance(token, network.rpc)
        : getAccountBalance(address, network.rpc))

      setBalance(balance)
    } catch (error) {
      console.error(error)
      const locked = await checkLockError(error)

      if (locked) {
        onLock()
      }
      setError(String(error))
    }
  }

  const onNetworkChange = async (networkLabel: string) => {
    try {
      setLoading(true)
      setError(null)
      const network = networks.find(({ label }) => networkLabel === label)
      setSelectedToken(null)
      setSelectedNetwork(network)
      setBalance(null)
      setWalletNetwork(network)
      await loadData(network, null)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    onNetworkChange(selectedNetwork.label)
  }, [])

  useEffect(() => {
    loadData(selectedNetwork, selectedToken)
  }, [selectedToken])

  if (!networks) {
    return null
  }

  return (
    <FlexColumnDiv sx={{ marginTop: '10px' }}>
      <Select
        defaultValue={selectedNetwork.label}
        disabled={loading}
        variant="outlined"
        size="small"
        fullWidth
        onChange={(event) => onNetworkChange(event.target.value)}
        data-testid="network-select"
      >
        {networks.map(({ label }) => (
          <MenuItem key={label} value={label}>
            {label}
          </MenuItem>
        ))}
      </Select>
      <FlexColumnDiv sx={{ alignItems: 'center', margin: '10px auto' }}>
        <Typography
          align="center"
          variant="body2"
          fontWeight="bold"
          sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {user?.ensUserName}
        </Typography>
        <FlexDiv sx={{ alignItems: 'center' }}>
          <Typography
            align="center"
            variant="body2"
            data-testid="address"
            sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {displayAddress(address)}
          </Typography>
          <ClipboardButton text={address} />
        </FlexDiv>
      </FlexColumnDiv>
      <Divider sx={{ marginBottom: '10px' }} />
      {error && (
        <ErrorMessage onClick={() => setErrorModalOpen(true)}>
          {intl.get('NETWORK_UNAVAILABLE_ERROR')}
        </ErrorMessage>
      )}
      {loading ? (
        <CircularProgress sx={{ margin: 'auto' }} />
      ) : (
        <>
          {balance ? (
            <FlexDiv>
              {selectedToken && (
                <IconButton size="large" onClick={() => setSelectedToken(null)}>
                  <ArrowBackIosNew />
                </IconButton>
              )}
              <Typography variant="h5" align="center" data-testid="balance" sx={{ margin: 'auto' }}>
                {displayBalance(balance, selectedToken)}
              </Typography>
            </FlexDiv>
          ) : (
            <CircularProgress size="small" sx={{ margin: 'auto' }} />
          )}

          <Button
            variant="contained"
            endIcon={<Send />}
            onClick={() => navigate(WalletRouteCodes.send)}
            data-testid="send-button"
            disabled={!balance}
            size="small"
            sx={{ marginTop: '20px' }}
          >
            {intl.get('SEND')}
          </Button>
          <TransactionHistory
            selectedToken={selectedToken}
            onTokenSelect={setSelectedToken}
            network={selectedNetwork}
          />
        </>
      )}
      <ErrorModal open={errorModalOpen} onClose={() => setErrorModalOpen(false)} error={error} />
    </FlexColumnDiv>
  )
}

export default WalletOverview
