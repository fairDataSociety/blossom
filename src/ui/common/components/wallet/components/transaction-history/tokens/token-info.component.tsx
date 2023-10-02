import React from 'react'
import { Token } from '../../../../../../../model/storage/wallet.model'
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { displayAddress } from '../../../../../utils/ethers'
import { BigNumber, utils } from 'ethers'

export interface TokenInfoProps {
  token: Token
  balance?: BigNumber
}

const TokenInfo = ({ token: { address, name, symbol, decimals }, balance }: TokenInfoProps) => {
  return (
    <List>
      <ListItem>
        <ListItemAvatar>
          <Avatar>{symbol}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondary={
            <>
              {balance && (
                <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                  {`${utils.formatUnits(balance, decimals)} ${symbol}`}
                </Typography>
              )}
              <Typography variant="caption" sx={{ display: 'block' }}>
                {displayAddress(address)}
              </Typography>
            </>
          }
        />
      </ListItem>
    </List>
  )
}

export default TokenInfo
