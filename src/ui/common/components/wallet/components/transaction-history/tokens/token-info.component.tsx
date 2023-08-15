import React from 'react'
import { Token } from '../../../../../../../model/storage/wallet.model'
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { displayAddress } from '../../../../../utils/ethers'

export interface TokenInfoProps {
  token: Token
}

const TokenInfo = ({ token: { address, name, symbol } }: TokenInfoProps) => {
  return (
    <List>
      <ListItem>
        <ListItemAvatar>
          <Avatar>{symbol}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={name} secondary={displayAddress(address)} />
      </ListItem>
    </List>
  )
}

export default TokenInfo
