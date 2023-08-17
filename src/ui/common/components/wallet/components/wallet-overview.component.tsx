import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import { BigNumber, utils } from 'ethers'
import Send from '@mui/icons-material/Send'
import { FlexColumnDiv, FlexDiv } from '../../utils/utils'
import { getAccountBalance, getTokenBalance } from '../../../../../messaging/content-api.messaging'
import { UserResponse } from '../../../../../model/internal-messages.model'
import { Button, CircularProgress, Divider, MenuItem, Select, Typography } from '@mui/material'
import { Network } from '../../../../../model/storage/network.model'
import { useNetworks } from '../../../hooks/networks.hooks'
import { roundEther } from '../../../utils/ethers'
import ClipboardButton from '../../clipboard-button/clipboard-button.component'
import { useNavigate } from 'react-router-dom'
import WalletRouteCodes from '../routes/wallet-route-codes'
import { useWallet } from '../context/wallet.context'
import ErrorMessage from '../../error-message/error-message.component'
import TransactionHistory from './transaction-history/transaction-history.component'
import { Token } from '../../../../../model/storage/wallet.model'

interface WalletOverviewProps {
  user: UserResponse
}

const WalletOverview = ({ user: { address, network } }: WalletOverviewProps) => {
  const { walletNetwork, setWalletNetwork, selectedToken, setSelectedToken } = useWallet()
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(walletNetwork || network)
  const [balance, setBalance] = useState<BigNumber | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { networks } = useNetworks()
  const navigate = useNavigate()

  const loadData = async (network: Network, token: Token) => {
    try {
      setBalance(null)

      const balance = await (token
        ? getTokenBalance(token, network.rpc)
        : getAccountBalance(address, network.rpc))

      setBalance(balance)
    } catch (error) {
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
      <FlexDiv sx={{ alignItems: 'center', margin: '10px auto' }}>
        <Typography
          align="center"
          variant="body2"
          data-testid="address"
          sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {address}
        </Typography>
        <ClipboardButton text={address} />
      </FlexDiv>
      <Divider sx={{ marginBottom: '10px' }} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading ? (
        <CircularProgress sx={{ margin: 'auto' }} />
      ) : (
        <>
          {balance ? (
            <Typography variant="h5" align="center" data-testid="balance">
              {selectedToken
                ? `${utils.formatUnits(balance, selectedToken.decimals)} ${selectedToken.symbol}`
                : `${roundEther(utils.formatEther(balance))} ETH`}
            </Typography>
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
            networkLabel={selectedNetwork.label}
          />
        </>
      )}
    </FlexColumnDiv>
  )
}

export default WalletOverview
