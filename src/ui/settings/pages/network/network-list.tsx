import React from 'react'
import intl from 'react-intl-universal'
import { Network } from '../../../../model/storage/network.model'
import { Button, Divider, ListItemText, MenuItem, MenuList } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import RouteCodes from '../../routes/route-codes'

export interface NetworkListProps {
  networks: Network[]
  onSelect: (network: Network) => void
}

const NetworkList = ({ networks, onSelect }: NetworkListProps) => {
  const navigate = useNavigate()

  return (
    <>
      <MenuList data-testid="network-list">
        {networks.map((network, index) => (
          <div key={network.label}>
            <MenuItem onClick={() => onSelect(network)}>
              <ListItemText sx={{ textAlign: 'center' }}>{network.label}</ListItemText>
            </MenuItem>
            {index < networks.length - 1 && <Divider sx={{ margin: '0 !important' }} />}
          </div>
        ))}
      </MenuList>
      <Button
        variant="contained"
        fullWidth
        sx={{ marginTop: '20px' }}
        onClick={() => navigate(RouteCodes.networkAdd)}
        data-testid="add-network-button"
      >
        {intl.get('ADD')}
      </Button>
    </>
  )
}

export default NetworkList
