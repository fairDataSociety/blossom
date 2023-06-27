import React from 'react'
import { IconButton, SvgIconTypeMap, Typography } from '@mui/material'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { FlexDiv } from '../utils/utils'
import { OverridableComponent } from '@mui/material/OverridableComponent'

export interface HeaderProps {
  title: string
  image: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>> & { muiName: string }
  backRoute?: string
}

const Header = (props: HeaderProps) => {
  const { title, backRoute } = props
  const Image = props.image

  const navigate = useNavigate()

  return (
    <FlexDiv sx={{ alignItems: 'center' }}>
      <IconButton onClick={() => navigate(backRoute || '..')}>
        <ArrowBack />
      </IconButton>
      <Typography variant="h6" align="center" sx={{ margin: '0 auto' }}>
        {title}
      </Typography>
      <Image sx={{ color: '#ddd' }} />
    </FlexDiv>
  )
}

export default Header
