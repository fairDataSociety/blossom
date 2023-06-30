import React from 'react'
import intl from 'react-intl-universal'
import CheckCircle from '@mui/icons-material/CheckCircle'
import { Button, Typography } from '@mui/material'
import { FlexColumnDiv } from '../../../utils/utils'
import { useNavigate } from 'react-router-dom'

export interface TransactionCompletedProps {
  onReset: () => void
}

const TransactionCompleted = ({ onReset }: TransactionCompletedProps) => {
  const navigate = useNavigate()

  return (
    <FlexColumnDiv>
      <FlexColumnDiv sx={{ marginTop: '20px' }}>
        <CheckCircle color="success" sx={{ margin: '0 auto' }} />
        <Typography align="center" variant="body1">
          {intl.get('TRANSACTION_COMPLETE')}
        </Typography>
      </FlexColumnDiv>
      <Button
        color="primary"
        variant="contained"
        sx={{
          marginTop: '20px',
        }}
        onClick={onReset}
      >
        {intl.get('SEND_ANOTHER')}
      </Button>
      <Button
        color="primary"
        variant="contained"
        sx={{
          marginTop: '20px',
        }}
        onClick={() => navigate('..')}
      >
        {intl.get('BACK')}
      </Button>
    </FlexColumnDiv>
  )
}

export default TransactionCompleted
