import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import { BigNumber, utils } from 'ethers'
import Send from '@mui/icons-material/Send'
import SettingsApplications from '@mui/icons-material/SettingsApplications'
import { FlexColumnDiv, FlexDiv } from '../../utils/utils'
import { getAccountBalance } from '../../../../../messaging/content-api.messaging'
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

interface WalletOverviewProps {
  user: UserResponse
}

const WalletOverview = ({ user: { address, network } }: WalletOverviewProps) => {
  const { walletNetwork, setWalletNetwork } = useWallet()
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(walletNetwork || network)
  const [balance, setBalance] = useState<BigNumber | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { networks } = useNetworks()
  const navigate = useNavigate()

  const loadData = async (network: Network) => {
    try {
      const balance = await getAccountBalance(address, network.rpc)

      setBalance(balance)
    } catch (error) {
      setError(String(error))
    }
  }

  const onNetworkChange = (networkLabel: string) => {
    const network = networks.find(({ label }) => networkLabel === label)
    setSelectedNetwork(network)
    setBalance(null)
    setWalletNetwork(network)
    loadData(network)
  }

  useEffect(() => {
    loadData(selectedNetwork)
  }, [])

  if (!networks) {
    return null
  }

  return (
    <FlexColumnDiv sx={{ marginTop: '10px' }}>
      <Select
        defaultValue={selectedNetwork.label}
        disabled={balance === null}
        variant="outlined"
        size="small"
        fullWidth
        onChange={(event) => onNetworkChange(event.target.value)}
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
          sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {address}
        </Typography>
        <ClipboardButton text={address} />
      </FlexDiv>
      <Divider sx={{ marginBottom: '10px' }} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {balance ? (
        <>
          <Typography variant="h5" align="center">
            {roundEther(utils.formatEther(balance))} ETH
          </Typography>
          <Button
            variant="contained"
            endIcon={<Send />}
            onClick={() => navigate(WalletRouteCodes.send)}
            data-testid="send-button"
            size="small"
            sx={{ marginTop: '20px' }}
          >
            {intl.get('SEND')}
          </Button>
          <Button
            variant="contained"
            endIcon={<SettingsApplications />}
            onClick={() => navigate(WalletRouteCodes.settings)}
            data-testid="send-button"
            size="small"
            sx={{ marginTop: '20px' }}
          >
            {intl.get('SETTINGS')}
          </Button>
        </>
      ) : (
        <CircularProgress sx={{ margin: 'auto' }} />
      )}
    </FlexColumnDiv>
  )
}

export default WalletOverview
