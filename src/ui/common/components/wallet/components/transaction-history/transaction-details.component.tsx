import React, { useMemo } from 'react'
import intl from 'react-intl-universal'
import {
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import Close from '@mui/icons-material/Close'
import { Transaction } from '../../../../../../model/storage/wallet.model'
import { constructBlockExplorerUrl, displayAddress, displayBalance } from '../../../../utils/ethers'
import { BigNumber, utils } from 'ethers'
import ClipboardButton from '../../../clipboard-button/clipboard-button.component'

export interface TransactionDetailsProps {
  open: boolean
  onClose: () => void
  transaction: Transaction
  blockExplorerUrl?: string
}

const TransactionDetailsModal = ({
  open,
  onClose,
  transaction,
  blockExplorerUrl,
}: TransactionDetailsProps) => {
  const gasCost = useMemo(() => {
    try {
      return utils
        .formatEther(
          BigNumber.from(transaction.content.gas).mul(BigNumber.from(transaction.content.gasPrice)),
        )
        .toString()
    } catch (error) {
      return 'Unknown'
    }
  }, [transaction])

  if (!open) {
    return null
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(90%, 400px)',
        backgroundColor: '#fff !important',
        boxShadow: 24,
        p: 4,
        padding: '20px 8px 30px 8px',
      }}
      components={{
        Backdrop: null,
      }}
    >
      <Box
        sx={{
          height: '100%',
          outline: 'none',
          '&:focus-visible': { outline: 'none' },
        }}
      >
        <Typography variant="h6" component="h2">
          {intl.get('TRANSACTION_DETAILS')}
        </Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 5, right: 5 }}>
          <Close />
        </IconButton>
        <Paper sx={{ width: '100%', height: '90%', overflow: 'auto', marginTop: '10px' }}>
          <TableContainer sx={{ overflow: 'auto' }}>
            <Table>
              <TableBody>
                <TableRow tabIndex={-1}>
                  <TableCell align="left">{intl.get('AMOUNT')}</TableCell>
                  <TableCell align="right">
                    {displayBalance(BigNumber.from(transaction.content.value), transaction.token)}
                  </TableCell>
                </TableRow>
                <TableRow tabIndex={-1}>
                  <TableCell align="left">{intl.get('RECIPIENT')}</TableCell>
                  <TableCell align="right">
                    {displayAddress(transaction.content.to)}
                    <ClipboardButton text={transaction.content.to} size="small" />
                  </TableCell>
                </TableRow>
                <TableRow tabIndex={-1}>
                  <TableCell align="left">{intl.get('TIME')}</TableCell>
                  <TableCell align="right">{new Date(transaction.time).toString()}</TableCell>
                </TableRow>
                <TableRow tabIndex={-1}>
                  <TableCell align="left">{intl.get('GAS_CONST')}</TableCell>
                  <TableCell align="right">{gasCost}</TableCell>
                </TableRow>
                <TableRow tabIndex={-1}>
                  <TableCell align="left">{intl.get('TRANSCTION_HASH')}</TableCell>
                  <TableCell align="right">
                    {blockExplorerUrl ? (
                      <a
                        target="_blank"
                        href={constructBlockExplorerUrl(blockExplorerUrl, transaction.content.hash)}
                      >
                        {displayAddress(transaction.content.hash as string)}
                      </a>
                    ) : (
                      displayAddress(transaction.content.hash as string)
                    )}
                    <ClipboardButton text={transaction.content.hash} size="small" />
                  </TableCell>
                </TableRow>
                <TableRow tabIndex={-1}>
                  <TableCell align="left">{intl.get('DATA')}</TableCell>
                  <TableCell align="right">
                    {transaction.content.data && (
                      <ClipboardButton text={transaction.content.data} size="small" />
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Modal>
  )
}

export default TransactionDetailsModal
