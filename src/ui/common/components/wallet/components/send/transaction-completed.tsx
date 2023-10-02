import React from 'react'
import intl from 'react-intl-universal'
import CheckCircle from '@mui/icons-material/CheckCircle'
import { Button, Typography } from '@mui/material'
import { FlexColumnDiv } from '../../../utils/utils'
import { useNavigate } from 'react-router-dom'
import { providers } from 'ethers'
import { Token } from '../../../../../../model/storage/wallet.model'
import { BigNumberString } from '../../../../../../model/general.types'
import { constructBlockExplorerUrl, displayAddress } from '../../../../utils/ethers'
import ClipboardButton from '../../../clipboard-button/clipboard-button.component'

export interface TransactionCompletedProps {
  value: BigNumberString
  token?: Token
  transaction: providers.TransactionReceipt
  blockExplorerUrl?: string
  onReset: () => void
}

const TransactionCompleted = ({
  value,
  token,
  transaction,
  blockExplorerUrl,
  onReset,
}: TransactionCompletedProps) => {
  const navigate = useNavigate()

  return (
    <FlexColumnDiv>
      <FlexColumnDiv sx={{ marginTop: '20px' }}>
        <CheckCircle color="success" sx={{ margin: '0 auto' }} />
        <Typography align="center" variant="body1" data-testid="transaction-complete-text">
          {intl.get('TRANSACTION_COMPLETE')}
        </Typography>
        <Typography variant="body1" align="center">
          {value} {token ? `${token.symbol} (${token.name})` : 'ETH'}
        </Typography>
        <Typography variant="body1" align="center">
          {blockExplorerUrl ? (
            <a
              target="_blank"
              href={constructBlockExplorerUrl(blockExplorerUrl, transaction.transactionHash)}
            >
              {displayAddress(transaction.transactionHash)}
            </a>
          ) : (
            <div>{displayAddress(transaction.transactionHash)}</div>
          )}
          <ClipboardButton text={transaction.transactionHash} />
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
        data-testid="back-button"
      >
        {intl.get('BACK')}
      </Button>
    </FlexColumnDiv>
  )
}

export default TransactionCompleted
