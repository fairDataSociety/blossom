import React from 'react'
import intl from 'react-intl-universal'
import DoneAll from '@mui/icons-material/DoneAll'
import Wrapper from '../components/wrapper'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import { Typography } from '@mui/material'

const ImportComplete = () => {
  return (
    <Wrapper>
      <Typography
        variant="body1"
        align="center"
        sx={{
          marginTop: '20px',
        }}
      >
        {intl.get('IMPORT_SUCCESS')}
      </Typography>
      <FlexColumnDiv>
        <DoneAll sx={{ margin: 'auto' }} data-testid="complete" />
      </FlexColumnDiv>
    </Wrapper>
  )
}

export default ImportComplete
