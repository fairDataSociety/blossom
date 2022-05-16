import React, { useMemo } from 'react'
import { styled } from '@mui/system'
import intl from 'react-intl-universal'
import { Button, Chip, Typography } from '@mui/material'
import { FlexColumnDiv, FlexDiv } from '../../../common/components/utils/utils'

export interface MnemonicProps {
  phrase: string
  onConfirm: () => void
}

const ContainerDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  margin: '20px auto 0 auto',
})

const Mnemonic = ({ phrase, onConfirm }: MnemonicProps) => {
  const words = useMemo(() => phrase.split(' '), [phrase])

  return (
    <FlexColumnDiv>
      <FlexDiv>
        <ContainerDiv>
          {words.map((word, index) => (
            <Typography variant="h6" key={word} sx={{ margin: '4px 0' }}>
              {index + 1}.
              <Chip label={word} sx={{ fontSize: '18px' }} />
            </Typography>
          ))}
        </ContainerDiv>
      </FlexDiv>
      <Button
        onClick={onConfirm}
        color="primary"
        variant="contained"
        size="large"
        sx={{
          padding: '10px 50px',
          margin: '50px auto 0 auto',
        }}
      >
        {intl.get('OK')}
      </Button>
    </FlexColumnDiv>
  )
}

export default Mnemonic
