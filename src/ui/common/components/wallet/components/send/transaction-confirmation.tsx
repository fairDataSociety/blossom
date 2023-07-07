import React, { useMemo, useState } from 'react'
import intl from 'react-intl-universal'
import { Avatar, Button, CircularProgress, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import Send from '@mui/icons-material/Send'
import { Address, BigNumberString } from '../../../../../../model/general.types'
import { FlexDiv } from '../../../utils/utils'
import GasEstimation from '../gas-estimation.component'
import { isAddressValid, isValueValid } from '../../../../utils/ethers'
import { UserResponse } from '../../../../../../model/internal-messages.model'
import { BigNumber, utils } from 'ethers'
import ErrorMessage from '../../../error-message/error-message.component'
import { useWalletLock } from '../../hooks/wallet-lock.hook'

export interface TransactionConfirmationProps {
  address: Address
  value: BigNumberString
  user: UserResponse
  rpcUrl: string
  error: string
  loading: boolean
  onCancel: () => void
  onSubmit: () => void
}

const TransactionConfirmation = ({
  address,
  value,
  user,
  rpcUrl,
  error,
  loading,
  onCancel,
  onSubmit,
}: TransactionConfirmationProps) => {
  const [gasPrice, setGasPrice] = useState<BigNumber>(BigNumber.from(0))
  useWalletLock()

  const realValue = useMemo(() => BigNumber.from(value).add(gasPrice), [gasPrice])

  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Send />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={address}
            secondary={intl.get('SENDING_TO')}
            sx={{ overflowWrap: 'anywhere' }}
          />
        </ListItem>
        <ListItem alignItems="center">
          <ListItemText primary={utils.formatEther(realValue)} secondary={intl.get('AMOUNT')} />
        </ListItem>
        {loading ? (
          <FlexDiv>
            <CircularProgress sx={{ margin: '10px auto' }} />
          </FlexDiv>
        ) : (
          <GasEstimation
            to={isAddressValid(address) ? address : user.address}
            value={isValueValid(value) ? value : '100000000000'}
            rpcUrl={rpcUrl}
            onGasEstimationUpdate={setGasPrice}
            sx={{ margin: 'auto', marginTop: '10px' }}
          />
        )}
        <FlexDiv sx={{ marginTop: '20px', justifyContent: 'space-around' }}>
          <Button
            color="secondary"
            variant="contained"
            disabled={loading}
            onClick={onCancel}
            sx={{ width: '200px' }}
          >
            {intl.get('CANCEL')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            disabled={loading}
            onClick={onSubmit}
            sx={{ width: '200px' }}
            data-testid="send-button"
          >
            {intl.get('SEND')}
          </Button>
        </FlexDiv>
      </List>
    </>
  )
}

export default TransactionConfirmation
