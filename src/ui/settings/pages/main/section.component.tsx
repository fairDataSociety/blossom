import React from 'react'
import { Button, Typography } from '@mui/material'
import { FlexColumnDiv } from '../../../common/components/utils/utils'

export interface SectionProps {
  children: React.ReactNode
  description: string
  image: JSX.Element
  onClick: () => void
}

const Section = ({ children, description, image, onClick }: SectionProps) => {
  return (
    <FlexColumnDiv sx={{ borderTop: '1px solid #ddd', padding: '5px 0', marginBottom: '10px' }}>
      <Typography variant="subtitle2" align="center" sx={{ marginBottom: '10px' }}>
        {description}
      </Typography>
      <Button variant="contained" endIcon={image} onClick={onClick}>
        {children}
      </Button>
    </FlexColumnDiv>
  )
}

export default Section
