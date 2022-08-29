import React from 'react'
import intl from 'react-intl-universal'
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  useTheme,
} from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Home from '@mui/icons-material/Home'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import { UserResponse } from '../../../../model/internal-messages.model'

export interface UserInfoProps {
  user: UserResponse
  onLogout: () => void
}

const UserInfo = ({ user: { username, account, network }, onLogout }: UserInfoProps) => {
  const theme = useTheme()

  return (
    <FlexColumnDiv sx={{ borderTop: '1px solid #ddd', padding: '5px 0', marginBottom: '10px' }}>
      <List sx={{ width: '100%' }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccountCircle />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={username || account} secondary={network?.label} data-testid="user-info" />
          {account && (
            <Tooltip title={intl.get('LOCAL_LOGIN_LABEL')}>
              <Home sx={{ color: theme.palette.border.main }} />
            </Tooltip>
          )}
        </ListItem>
      </List>
      <Button variant="contained" onClick={onLogout} size="small" data-testid="logout-btn">
        {intl.get('LOGOUT')}
      </Button>
    </FlexColumnDiv>
  )
}

export default UserInfo
