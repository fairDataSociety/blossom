import React from 'react'
import intl from 'react-intl-universal'
import { styled } from '@mui/system'
import { Typography } from '@mui/material'
import Info from '@mui/icons-material/Info'
import RouteCodes from '../../routes/route-codes'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import Header from '../../../common/components/header/header.component'

export const Logo = styled('img')({
  width: '48px',
  margin: 'auto',
  marginTop: '10px',
})

const About = () => {
  return (
    <FlexColumnDiv>
      <Header title="Blossom Browser Extension" image={Info} />
      <Logo src="icons/blossom48.png" />
      <Typography variant="h6" align="center" sx={{ margin: '10px 0' }}>
        Fair Data Society
      </Typography>
      <Typography variant="body1" align="center" sx={{ margin: '10px 0' }}>
        {intl.get('VERSION')} {chrome.runtime.getManifest().version}
      </Typography>
      <Typography
        variant="body1"
        align="center"
        component="a"
        href={`settings.html#${RouteCodes.privacyPolicy}`}
        target="_blank"
        sx={{ margin: '10px 0' }}
      >
        {intl.get('PRIVACY_POLICY')}
      </Typography>
    </FlexColumnDiv>
  )
}

export default About
