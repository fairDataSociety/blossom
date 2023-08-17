import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import { Avatar, Button, IconButton, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew'
import { getWalletTokens } from '../../../../../../../messaging/content-api.messaging'
import { Token } from '../../../../../../../model/storage/wallet.model'
import { FlexColumnDiv, FlexDiv } from '../../../../utils/utils'
import { useNavigate } from 'react-router-dom'
import WalletRouteCodes from '../../../routes/wallet-route-codes'
import TokenInfo from './token-info.component'
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
    <FlexColumnDiv>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {selectedToken ? (
        <>
          <TokenInfo token={selectedToken} />
          <FlexDiv>
            <FlexDiv sx={{ margin: 'auto' }}>
              <IconButton size="large" onClick={() => onTokenSelect(null)} sx={{ marginRight: '20px' }}>
                <ArrowBackIosNew />
              </IconButton>
            </FlexDiv>
          </FlexDiv>
        </>
      ) : (
        <>
          <List data-testid="token-list">
            {tokens.map((token) => (
              <ListItemButton key={token.name} onClick={() => onTokenSelect(token)}>
                <ListItemAvatar>
                  <Avatar>{token.symbol}</Avatar>
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
        </>
      )}
    </FlexColumnDiv>
  )
}

export default Tokens
