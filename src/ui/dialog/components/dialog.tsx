import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import { AppBar, Button, GlobalStyles, Typography } from '@mui/material'
import { FlexDiv } from '../../common/components/utils/utils'
import { sendMessage } from '../../../messaging/scripts.messaging'
import BackgroundAction from '../../../constants/background-actions.enum'
import { DialogQuestion } from '../../../model/internal-messages.model'

const Dialog = () => {
  const [{ question, placeholders }, setQuestion] = useState<DialogQuestion>({} as DialogQuestion)

  const getQuestion = async () => {
    const question = await sendMessage<void, DialogQuestion>(BackgroundAction.DIALOG_REQUEST)

    setQuestion(question)
  }

  const sendAnswer = async (answer: boolean) => {
    await sendMessage<boolean, void>(BackgroundAction.DIALOG_RESPONSE, answer)
  }

  const onConfirm = () => sendAnswer(true)

  const onCancel = () => sendAnswer(false)

  useEffect(() => {
    getQuestion()
  }, [])

  if (!question) {
    return null
  }

  return (
    <FlexDiv sx={{ minWidth: '300px', height: '100%', position: 'relative' }}>
      <GlobalStyles
        styles={{
          html: {
            height: '100%',
            width: '100%',
          },
          body: {
            height: '100%',
          },
          '#root': {
            height: '100%',
          },
        }}
      />
      <AppBar sx={{ height: '50px', display: 'flex' }}>
        <Typography variant="h5" sx={{ margin: 'auto' }}>
          Blossom
        </Typography>
      </AppBar>
      <FlexDiv sx={{ marginTop: '50px', padding: '20px' }}>
        <Typography variant="body1" sx={{ margin: 'auto', marginTop: '20px' }}>
          {intl.get(question, placeholders)}
        </Typography>
      </FlexDiv>
      <FlexDiv
        sx={{
          minHeight: '30px',
          position: 'absolute',
          bottom: 0,
          padding: '10px',
          paddingBottom: '20px',
          display: 'flex',
          width: '100%',
        }}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={onConfirm}
          sx={{
            width: '40%',
            margin: 'auto',
          }}
        >
          {intl.get('CONFIRM')}
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={onCancel}
          sx={{
            width: '40%',
            margin: 'auto',
          }}
        >
          {intl.get('CANCEL')}
        </Button>
      </FlexDiv>
    </FlexDiv>
  )
}

export default Dialog
