import React from 'react'
import { styled } from '@mui/system'

export interface CenteredWrapperProps {
  children: React.ReactNode
}

const WrapperDiv = styled('div')({
  width: '100%',
  display: 'flex',
})

const InnerDiv = styled('div')(() => ({
  displey: 'flex',
  margin: 'auto',
  minWidth: '500px',
}))

const CenteredWrapper = ({ children }: CenteredWrapperProps) => {
  return (
    <WrapperDiv>
      <InnerDiv>{children}</InnerDiv>
    </WrapperDiv>
  )
}

export default CenteredWrapper
