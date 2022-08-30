import React, { useState } from 'react'
import intl from 'react-intl-universal'
import { Tab, Tabs } from '@mui/material'
import Wrapper from '../components/wrapper'
import { Box } from '@mui/system'
import RemoteLogin from './remote-login'
import LocalLogin from './local-login'
import { FlexColumnDiv } from '../../../common/components/utils/utils'

const Login = () => {
  const [tabIndex, setTabIndex] = useState<number>(0)

  const onTabChange = (event: React.SyntheticEvent, tabIndex: number) => setTabIndex(tabIndex)

  return (
    <Wrapper>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={onTabChange}>
          <Tab label={intl.get('FDS')} />
          <Tab label={intl.get('LOCAL')} />
        </Tabs>
      </Box>
      <FlexColumnDiv sx={{ paddingTop: '30px' }}>
        {tabIndex === 0 && <RemoteLogin />}
        {tabIndex === 1 && <LocalLogin />}
      </FlexColumnDiv>
    </Wrapper>
  )
}

export default Login
