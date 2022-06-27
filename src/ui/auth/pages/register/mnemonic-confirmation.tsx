import React, { useMemo, useState } from 'react'
import { styled } from '@mui/system'
import intl from 'react-intl-universal'
import { shuffleArray } from '../../../common/utils/array'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import { Button, Chip, Typography } from '@mui/material'
import { Mnemonic } from '../../../../model/general.types'

export interface MnemonicConfirmationProps {
  phrase: Mnemonic
  onConfirm: () => void
}

const ContainerDiv = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  maxWidth: '500px',
  margin: '20px auto 0 auto',
})

const ListDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  margin: '20px auto 0 auto',
})

const MnemonicConfirmation = ({ phrase, onConfirm }: MnemonicConfirmationProps) => {
  const [selected, setSelected] = useState<string[]>([])
  const words = useMemo<string[]>(() => shuffleArray(phrase.split(' ')), [phrase])

  const isSelected = (word: string): boolean => {
    return selected.indexOf(word) >= 0
  }

  const addSelected = (word: string) => {
    setSelected([...selected, word])
  }

  const removeSelected = (word: string) => {
    const selectedCopy = [...selected]
    selectedCopy.splice(selectedCopy.indexOf(word), 1)
    setSelected(selectedCopy)
  }

  const isOrderCorrect = () => selected.join(' ') === phrase

  return (
    <FlexColumnDiv>
      <ContainerDiv data-testid="mnemonic-confirmation">
        {words.map((word, index) => {
          const selected = isSelected(word)

          return (
            <Chip
              key={index}
              label={word}
              onClick={() => (selected ? removeSelected(word) : addSelected(word))}
              variant={selected ? 'filled' : 'outlined'}
              sx={{ fontSize: '16px', marginRight: '20px', marginBottom: '20px' }}
            />
          )
        })}
      </ContainerDiv>
      <ListDiv>
        {selected.map((word, index) => (
          <Typography variant="h5" key={word} sx={{ margin: '4px 0' }}>
            {index + 1}. {word}
          </Typography>
        ))}
      </ListDiv>
      <Button
        onClick={onConfirm}
        disabled={!isOrderCorrect()}
        color="primary"
        variant="contained"
        size="large"
        data-testid="submit"
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

export default MnemonicConfirmation
