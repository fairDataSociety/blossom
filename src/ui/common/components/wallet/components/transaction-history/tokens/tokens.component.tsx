import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import { Avatar, Button, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import { getWalletTokens } from '../../../../../../../messaging/content-api.messaging'
import { Token } from '../../../../../../../model/storage/wallet.model'
import { FlexColumnDiv, FlexDiv } from '../../../../utils/utils'
import { useNavigate } from 'react-router-dom'
import WalletRouteCodes from '../../../routes/wallet-route-codes'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorMessage from '../../../../error-message/error-message.component'
import { displayAddress } from '../../../../../utils/ethers'

export interface TokensProps {
  networkLabel: string
  selectedToken: Token | null
  onTokenSelect: (token: Token | null) => void
}

const Tokens = ({ networkLabel, selectedToken, onTokenSelect }: TokensProps) => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const loadData = async () => {
    try {
      const tokens = await getWalletTokens(networkLabel)

      setTokens(tokens)
    } catch (error) {
      setError(String(error))
    }
  }

  useEffect(() => {
    loadData()
  }, [networkLabel])

  return (
    <FlexColumnDiv sx={{ maxHeight: 200 }}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <List data-testid="token-list">
        {tokens.map((token) => (
          <ListItemButton
            key={token.name}
            onClick={() => onTokenSelect(token.name === selectedToken?.name ? null : token)}
          >
            <ListItemAvatar>
              {token.name === selectedToken?.name ? (
                <CheckCircleIcon color="success" sx={{ width: 40, height: 40 }} />
              ) : (
                <Avatar>{token.symbol}</Avatar>
              )}
            </ListItemAvatar>
            <ListItemText primary={token.name} secondary={displayAddress(token.address)} />
          </ListItemButton>
        ))}
      </List>
      <Button
        variant="text"
        onClick={() => navigate(WalletRouteCodes.importToken)}
        sx={{ fontWeight: 'bold' }}
        data-testid="import-token-btn"
      >
        {intl.get('IMPORT_TOKEN')}
      </Button>
    </FlexColumnDiv>
  )
}

export default Tokens
