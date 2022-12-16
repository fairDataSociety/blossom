import React from 'react'
import NavigateNext from '@mui/icons-material/NavigateNext'
import { Divider, ListItemText, MenuItem, MenuList } from '@mui/material'
import { DappId } from '../../../../model/general.types'

export interface DappIdListProps {
  dappIds: DappId[]
  onSelect: (dappId: DappId) => void
}

const DappIdList = ({ dappIds, onSelect }: DappIdListProps) => {
  return (
    <MenuList data-testid="dapp-permissions-list">
      {dappIds.map((dappId, index) => (
        <div key={dappId}>
          <MenuItem onClick={() => onSelect(dappId)}>
            <NavigateNext />
            <ListItemText sx={{ textAlign: 'center' }}>{dappId}</ListItemText>
          </MenuItem>
          {index < dappIds.length - 1 && <Divider sx={{ margin: '0 !important' }} />}
        </div>
      ))}
    </MenuList>
  )
}

export default DappIdList
