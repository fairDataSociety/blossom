import React from 'react'
import intl from 'react-intl-universal'
import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import { UserResponse } from '../../../../model/internal-messages.model'

export interface UserInfoProps {
  user: UserResponse
  onLogout: () => void
}

const UserInfo = ({ user: { username, network }, onLogout }: UserInfoProps) => {
  return (
    <FlexColumnDiv sx={{ borderTop: '1px solid #ddd', padding: '5px 0', marginBottom: '10px' }}>
      <List sx={{ width: '100%' }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccountCircle />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={username} secondary={network?.label} data-testid="user-info" />
        </ListItem>
      </List>
      <Button variant="contained" onClick={onLogout} size="small" data-testid="logout-btn">
        {intl.get('LOGOUT')}
      </Button>
    </FlexColumnDiv>
  )
}

export default UserInfo
