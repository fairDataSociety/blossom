import React from 'react'
import { styled } from '@mui/system'

export interface CenteredWrapperProps {
  children: React.ReactNode
}

const WrapperDiv = styled('div')({
  width: '100%',
  display: 'flex',
})

const InnerDiv = styled('div')(({ theme }) => ({
  displey: 'flex',
  margin: 'auto',
  minWidth: '500px',
  [theme.breakpoints.down('sm')]: {
    minWidth: '100%',
  },
}))

const CenteredWrapper = ({ children }: CenteredWrapperProps) => {
  return (
    <WrapperDiv>
      <InnerDiv>{children}</InnerDiv>
    </WrapperDiv>
  )
}

export default CenteredWrapper
